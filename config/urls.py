from knox import views as knox_views
from django.urls import path

from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [

    # home
    path('', views.home),
    path('api/', views.home),

    # URLs
    path('api/routes/', views.getRoutes),

    # USER
    path('api/users/', views.UsersAPI.as_view()),
    path('api/user/', views.UserAPI.as_view()),
    path('api/user/login/', views.loginUser, name='login'),
    path('api/user/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/user/<int:id>/', views.UserFromIdAPI.as_view()),

    # Courses
    path('api/courses/', views.CoursesAPI.as_view()),
    path('api/courses-user/', views.CoursesUserAPI.as_view()),
    path('api/courses/<int:id>/', views.CourseAPI.as_view()),

    # Passenger
    path('api/passengers/', views.PassengersAPI.as_view()),
    path('api/passengers-user/', views.PassengersUserAPI.as_view()),
    path('api/passengers/<int:id>/', views.PassengerAPI.as_view()),

    # Notes
    path('api/notes/', views.NotesAPI.as_view()),
    path('api/notes/<int:id>/', views.NoteAPI.as_view()),
    path('api/notes/courses/<int:course_id>/user-rated/<int:rated_id>/', views.NotesSomeoneAPI.as_view()),
    path('api/notes/user/<int:user_id>/', views.NoteFromUserIdAPI.as_view()),

]