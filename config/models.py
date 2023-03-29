from django.db import models
from django.contrib.auth.models import AbstractUser

# User Model Customization

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.CharField(max_length=255)
    end = models.CharField(max_length=255)
    date = models.DateField()
    creation_date = models.DateField()


class Passenger(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    status = models.IntegerField()
    note = models.IntegerField()
