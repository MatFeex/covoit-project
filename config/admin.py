from django.contrib import admin
from .models import User, Course, Note, Passenger

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Note)
admin.site.register(Passenger)

