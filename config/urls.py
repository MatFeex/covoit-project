from knox import views as knox_views
from .views import LoginAPI, RegisterAPI
from django.urls import path

from django.contrib import admin
from django.urls import path
from config import views

urlpatterns = [
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('config/<int:id>/update/',views.privateUserUpdate, name='privateUser-update' ),
    path('config/<int:id>/',views.privateUserDetails, name='privateUser-details'),
]