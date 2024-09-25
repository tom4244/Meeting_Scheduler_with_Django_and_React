from django.contrib.auth import authenticate
from rest_framework import serializers
from scheduler.models import AuthGroup, AuthUser, Person, Session, SessionEntry
from scheduler.models import Photos

class AuthGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthGroup
        fields = ['name']

class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = ('id', 'password', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', )

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize registration requests and create a new user.
    """
    class Meta:
        model = AuthUser
        fields = ('id', 'password', 'last_login', 'is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined')
        # extra_kwargs = {"password": {"write_only": True}}

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer class to authenticate users with username and password.
    """
    # email = serializers.CharField()
    # password = serializers.CharField(write_only=True
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person 
        # fields = '__all__'
        fields = ['username', 'mtg_types']

class PersonMtgTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person 
        fields = ['id', 'username', 'created_at', 'updated_at', 'mtg_types']

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session 
        fields = ['id', 'mtg_types', 'students_string', 'weekday', 'class_datetime', 'week_number', 'number_of_weeks', 'selected_weekdays', 'mtg_requester', 'created_at', 'updated_at', 'endtime', 'first_names_string']

class SessionEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionEntry 
        fields = ['id', 'created_at', 'updated_at', 'user', 'entry']

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photos
        fields='__all__'


