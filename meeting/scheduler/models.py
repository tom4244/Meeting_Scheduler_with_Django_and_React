# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
import os
from pathlib import Path

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


    # password = models.BinaryField(max_length=128)
class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Person(models.Model):
    auth_user_id = models.ForeignKey(AuthUser, db_column='auth_user_id', related_name='auth_user_id', on_delete=models.CASCADE)
    username = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    mtg_types = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'person'


class Session(models.Model):
    mtg_types = models.CharField(blank=True, null=True)
    students_string = models.CharField(blank=True, null=True)
    weekday = models.CharField(blank=True, null=True)
    class_datetime = models.DateTimeField(blank=True, null=True)
    week_number = models.SmallIntegerField(blank=True, null=True)
    number_of_weeks = models.SmallIntegerField(blank=True, null=True)
    selected_weekdays = models.CharField(blank=True, null=True)
    mtg_requester = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    endtime = models.DateTimeField(blank=True, null=True)
    first_names_string = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'session'


class SessionEntry(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    user = models.CharField(blank=True, null=True)
    entry = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'session_entry'

def photo_directory_path(instance, filename):
    print("instance in photo_directory_path: ", instance)
    print("Path.cwd(): ", Path.cwd())
    # photo will be uploaded to scheduler/userPhotos/filename
    fullname = "scheduler/userPhotos/{0}".format(instance.user + '.jpg')
    if os.path.exists(fullname):
        os.remove(fullname)
    return fullname

class Photos(models.Model):
    user=models.CharField(max_length=80)
    name=models.CharField(max_length=80)
    selectedPhotoFile=models.ImageField(upload_to=photo_directory_path)


