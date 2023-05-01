from knox import views as knox_views
from django.urls import path

from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [
    # Authentication
    path('api/register/', views.createUser, name='register'),
    path('api/login/', views.loginUser, name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),

    # Users
    path('api/users/', views.getUsers),
    path('api/users/<int:id>/', views.getUser),
    path('api/users/update/<int:id>/', views.updateUser),

    # Courses
    path('api/courses/', views.getCourses),
    path('api/courses/<int:id>/', views.getCourse),

    # Passengers
    path('api/passengers/', views.getPassengers),
    path('api/passengers/<int:id>/', views.getPassenger),

    # Notes
    path('api/notes/', views.getNotes),
    path('api/notes/<int:id>/', views.getNote),
]