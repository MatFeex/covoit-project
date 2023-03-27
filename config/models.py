from django.db import models
from django.contrib.auth.models import User

# User Model Customization

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
