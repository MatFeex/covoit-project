from knox import views as knox_views
from django.urls import path

from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [

    # URLs
    path('api/routes/', views.getRoutes),

    # USER
    path('api/users/', views.UsersAPI.as_view()),
    path('api/user/', views.UserAPI.as_view()),
    path('api/user/login/', views.loginUser, name='login'),
    path('api/user/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/user/<int:id>/', views.UserAPI.as_view()),

    # Courses
    path('api/courses/', views.CoursesAPI.as_view()),
    path('api/courses-user/', views.CoursesUserAPI.as_view()),
    path('api/courses/<int:id>/', views.CourseAPI.as_view()),

    # Notes
    path('api/courses/<int:course_id>/passengers/<int:passenger_id>/note/', views.NotePassengerAPI.as_view()),
]