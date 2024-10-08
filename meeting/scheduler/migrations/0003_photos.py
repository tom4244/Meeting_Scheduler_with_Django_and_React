# Generated by Django 5.0.7 on 2024-09-13 01:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0002_authgroup_authgrouppermissions_authpermission_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=80)),
                ('name', models.CharField(max_length=80)),
                ('selectedPhotoFile', models.ImageField(upload_to='UserPhotos')),
            ],
        ),
    ]
