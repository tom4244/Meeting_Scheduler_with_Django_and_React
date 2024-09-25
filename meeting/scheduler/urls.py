from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from scheduler import views

app_name = "scheduler"

urlpatterns = [
    path('mtgScheduler/user/', views.user_list),
    path('user/', views.user_detail, name='user'),
    path('register/', views.UserRegistrationAPIView.as_view(), name="register"),
    path('login/', views.UserLoginAPIView.as_view(), name="login"),
    path('mtgScheduler/logout/', views.UserLogoutAPIView.as_view(), name="logout"),
    path('mtgScheduler/Classes/', views.session_list),
    path('mtgScheduler/pastClasses/', views.session_list_past),
    path('mtgScheduler/mtg_types/<str:user>', views.mtg_types),
    path('mtgScheduler/selfIntros/<str:user>/', views.read_file),
    path('mtgScheduler/meeting', views.meeting),
    path('mtgScheduler/meetingEntry', views.meetingEntry),
    path('mtgScheduler/cancelSessions', views.cancelSessions),
    path('cancelSessions', views.cancelSessions),
    path('mtgScheduler/get_user_photo/<str:user>/', views.get_user_photo),
    path('uploadPhoto', views.uploadPhoto.as_view()),
    path('postSelfInfoText', views.postSelfInfoText),
    path('update_mtg_types', views.update_mtg_types),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])

