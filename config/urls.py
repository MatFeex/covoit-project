from knox import views as knox_views
from django.urls import path

from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [

    # USER
    path('api/users/', views.UsersAPI.as_view()),
    path('api/users/login/', views.loginUser, name='login'),
    path('api/users/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/users/<int:id>/', views.UserAPI.as_view()),

    # Courses
    path('api/courses/', views.CoursesAPI.as_view()),
    path('api/courses/<int:id>/', views.CourseAPI.as_view()),
]