from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# User Model Customization

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.IntegerField(default=5)

    def __str__(self):
        return f"Note :{self.note}/5"


class Course(models.Model):
    choices = [
        ('En attente de passagers','En attente de passagers'),
        ('Validée', 'Validée'),
        ('Annulée', 'Annulée')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.CharField(max_length=255)
    end = models.CharField(max_length=255)
    date = models.DateTimeField(default=timezone.now())
    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=choices, default='En attente de passagers')

    def __str__(self):
        return f"Course vers EPF avec {self.user.first_name} {self.user.last_name} le {self.date}"


class Passenger(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f"Passager {self.user.first_name} {self.user.last_name} de la course #{self.course.id}"

