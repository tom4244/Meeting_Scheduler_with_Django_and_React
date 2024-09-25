from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes 
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import viewsets
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from scheduler.models import AuthUser, Person, Session, SessionEntry, Photos
from .serializers import SessionSerializer, AuthUserSerializer
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from .serializers import PersonSerializer, SessionEntrySerializer
from .serializers import PersonMtgTypesSerializer, PhotoSerializer
import bcrypt, datetime, os
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from collections import deque
from operator import itemgetter
from .models import Photos
import shutil

User = get_user_model()

class UserRegistrationAPIView(GenericAPIView):
    """
    An endpoint for the client to create a new User.
    """
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        first_name = request.data['first_name'] 
        last_name = request.data['last_name'] 
        # Password is validated elsewhere now, no this is not used.
        # confirmpass = request.data['confirmpass']
        mtgTypes = request.data['mtgTypes']
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']
        user = User.objects.create_user(username, email, password)
        user.is_superuser = False
        user.is_staff = False
        user.is_active = True
        now = datetime.datetime.now().isoformat()
        user.date_joined = now
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        shutil.copy('scheduler/selfIntros/anonymous.txt', 'scheduler/selfIntros/' + user.username + '.txt')
        shutil.copy('scheduler/userPhotos/anonymous.jpg', 'scheduler/userPhotos/' + user.username + '.jpg')
        # Create entries in 'person' table
        # The 'person' table contains extra user data not in the auth_user table
        personEntry = {'username': user.username, 'mtg_types': request.data['mtgTypes']}
        now = datetime.datetime.now().isoformat()
        personEntry['created_at'] = now
        personEntry['updated_at'] = now
        serializer = PersonMtgTypesSerializer(data=personEntry)
        print("personEntry: ", personEntry)
        if serializer.is_valid():
            serializer.save()
        else: 
            print("Serializer is not valid in views/UsrRegistrationAPIView.py.")
        if user:
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(GenericAPIView):
    """
    An endpoint to authenticate existing users using their email and password.
    """
    permission_classes = (AllowAny,)
    authentication_class = SessionAuthentication

    def post(self, request, *args, **kwargs):
        print("UserLogin request.data: ", request.data)
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            serializer = AuthUserSerializer(user)
            user = authenticate(username=request.data['username'], password=request.data['password'])
            print("Made it to login.")
            login(request, user)
            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)

class UserLogoutAPIView(GenericAPIView):
    """
    An endpoint to logout users.
    """
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def user_list(request):
    """
    List all code person, or create a new person.
    """
    if request.method == 'GET':
        user = AuthUser.objects.all()
        serializer = AuthUserSerializer(user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AuthUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def session_list(request):
    """
    List all present and future sessions.
    """
    print("request['_user']", request._user)
    if request.method == 'GET':
        session = Session.objects.filter(mtg_requester=request._user)\
                .filter(endtime__gte=datetime.date.today()) |\
                Session.objects.filter(students_string__contains=request._user)\
                .filter(endtime__gte=datetime.date.today()) 
        serializer = SessionSerializer(session, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def session_list_past(request):
    """
    List all sessions with a date before today.
    """
    print("slpast request['_user']", request._user)
    if request.method == 'GET':
        session = Session.objects.filter(mtg_requester=request._user)\
                .filter(endtime__lt=datetime.date.today()) |\
                Session.objects.filter(students_string__contains=request._user)\
                .filter(endtime__lt=datetime.date.today()) 
        serializer = SessionSerializer(session, many=True)
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Retrieve, update or delete a code person.
    """
    try:
        user = AuthUser.objects.get(pk=pk)
    except AuthUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AuthUserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AuthUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        auth_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def getDayNumber(weekday):
    dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return dayNames.index(weekday)

def calcDayInterval(weekday, lastWeekday):
    diff = getDayNumber(weekday) - getDayNumber(lastWeekday)
    if (diff > 0):
        return diff
    else:
        return diff + 7

@api_view(['POST'])
def meeting(request):
    """
    New meeting data
    """
    classAMPM = request._data['classAMPM']
    classDate = request._data['classDate'] 
    classEndAMPM = request._data['classEndAMPM'] 
    classEndHour = request._data['classEndHour'] 
    classEndMinutes = int(request._data['classEndMinutes'])
    classEndTime = request._data['classEndTime'] 
    classFirstDay = request._data['classFirstDay'] 
    classHour = request._data['classHour'] 
    classMinutes = int(request._data['classMinutes'])
    classMonth = request._data['classMonth'] 
    classWeekday = request._data['classWeekday'] 
    classYear = request._data['classYear'] 
    first_names_string = request._data['first_names_string'] 
    mtg_types = request._data['mtg_types'] 
    number_of_weeks = request._data['number_of_weeks'] 
    selected_weekdays = request._data['selected_weekdays'] 
    students_string = request._data['students_string']
    timezoneOffset = request._data['timezoneOffset']
    user = request._data['user']
    weekdaysString = request._data['weekdaysString']

    if (classAMPM == 'p.m.'):
        addPMHours = 12
    else: 
        addPMHours = 0
    if (classHour == 12):
        classHourAMPM = addPMHours
    else: 
        classHourAMPM = classHour + addPMHours
    # time is part of the 'date' column in timestamptz format
    firstDay = parse(classFirstDay)
    endTime = parse(classEndTime)
    thisClassDay = parse(classFirstDay)
    lastDate = thisClassDay.date()
    hoursInterval = endTime.hour - firstDay.hour
    if hoursInterval < 0:
        hoursInterval = hoursInterval + 24
    saveArray = []
    week_number = 0
    date = ""
    # Subsequent meetings are calculated based on selected weekdays and number of weeks
    # Rotate the list of weekdays as needed so that dates start with the correct first weekday 
    dayOrder = deque(selected_weekdays)
    if (dayOrder[0] != classWeekday):
        while (dayOrder[0] != classWeekday):
            dayOrder.rotate(1)
    lastWeekday = dayOrder[0]
    thisClassDay = parse(classFirstDay)
    while (week_number < number_of_weeks):
        week_number += 1
        for weekday in dayOrder:
            dayInterval = calcDayInterval(weekday, lastWeekday)
            if ((week_number != 1) or (weekday != dayOrder[0])):
                delta = relativedelta(days = dayInterval)
                thisClassDay += delta
            weekday_endtime = thisClassDay
            delta = relativedelta(hours = hoursInterval)
            weekday_endtime += delta
            delta = relativedelta(minute = classEndMinutes)
            weekday_endtime += delta
            # make a unique Date object so that each one doesn't equal the newest since it's call by reference
            lastWeekday = weekday
            lastDate = thisClassDay.date()
            now = datetime.datetime.now().isoformat()
            sessionEntry = {'mtg_types': mtg_types, 'students_string': students_string, 'weekday': weekday, 'class_datetime': thisClassDay, 'week_number': week_number, 'number_of_weeks': number_of_weeks, 'selected_weekdays': weekdaysString, 'mtg_requester': user, 'created_at': now, 'updated_at': now, 'endtime': weekday_endtime, 'first_names_string': first_names_string }

            serializer = SessionSerializer(data=sessionEntry)
            if serializer.is_valid():
                serializer.save()
            else:
                print("Serializer is not valid in views.py.")
    print("Finished adding new sessions.")
    return Response(serializer.data)

@api_view(['POST'])
def meetingEntry(request):
    """
    New meeting summary 
    """
    now = datetime.datetime.now().isoformat()
    print("vars(request) in meetingEntry: ", vars(request))
    entry = {'created_at': now, 'updated_at': now, 'user': request._data['user'], 'entry': request._data['entry']}
    serializer = SessionEntrySerializer(data=entry)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def cancelSessions(request):
    """
    Remove sessions that were selected to be canceled.
    """
    ids_to_cancel = request._data
    try:
        for id in ids_to_cancel:
            Session.objects.filter(id=id).delete()
    except ids_to_cancel == []:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(ids_to_cancel)

@api_view(['GET'])
def get_user_photo(request, user, format=None):
    """
    Get user photo
    """
    try:
        print("user in get_user_photo: ", user)
        thisdir = os.path.dirname(__file__) 
        userfilename = user + '.jpg'
        file_path = os.path.join(thisdir, 'userPhotos/', userfilename)
        print("user in get_user_photo: ", user, "  file_path:", file_path)
        return FileResponse(open(file_path, 'rb'))
    except (IOError, OSError):
        return Response(status=status.HTTP_400_BAD_REQUEST)

class uploadPhoto(APIView):
    """
    Respond to change user photo request.
    """
    parser_class=(MultiPartParser)

    def post(self, request, *args, **kwargs):
        photo_serializer=PhotoSerializer(data=request._full_data) 
        if photo_serializer.is_valid():
            photo_serializer.save()
            return Response(photo_serializer.data,status=status.HTTP_201_CREATED)

        else:
            print('error',photo_serializer.errors)
            return Response(photo_serializer.errors,status=status.HTTP_400_BAD_REQUEST)

def read_file(request, user, format=None):
    """
    Retrieve user info text file
    """
    thisdir = os.path.dirname(__file__) 
    userfilename = user + '.txt'
    file_path = os.path.join(thisdir, 'selfIntros/', userfilename)
    print("user: ", user, "  file_path:", file_path)
    f = open(file_path, 'r')
    file_contents = f.read()
    print (file_contents)
    f.close()
    return HttpResponse(file_contents, content_type="text/plain") 

@api_view(['POST'])
def postSelfInfoText(request):
    """
    Post user info text file
    """
    text = request._data["selfIntro"]
    user = request._data["user"]
    thisdir = os.path.dirname(__file__) 
    userfilename = user + '.txt'
    file_path = os.path.join(thisdir, 'selfIntros/', userfilename)
    print("user: ", user, "  file_path:", file_path)
    with open(file_path,'w') as f:
        f.write(text)
    return HttpResponse(text, content_type="text/plain") 

@api_view(['GET'])
def mtg_types(request, user, format=None):
    """
    Get a user's meeting types.
    """
    if request.method == 'GET':
        person = Person.objects.filter(username=user)
        serializer = PersonSerializer(person, many=True)
        return Response(serializer.data[0]['mtg_types'])


@api_view(['PUT'])
def update_mtg_types(request):
    """
    Update a user's meeting types.
    """
    try:
        user = request.data['user']
        types = request._data['mtg_types']
        record = Person.objects.get(username=user)
        record.mtg_types = types
        record.save()
        return Response(types)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
