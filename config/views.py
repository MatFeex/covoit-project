from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import login
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from config.models import User
from django.core.mail import send_mail
from django.shortcuts import redirect
from config.forms import PrivateUserForm

  


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) # get data
        serializer.is_valid(raise_exception=True) # check if valid & raise exception otherwise
        user = serializer.save() # save user if valid

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })
    


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        request.data['username'] = request.data['email']
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)
    
    
def privateUserUpdate(request, id):
    privateUser = User.objects.get(id=id)

    if request.method == 'POST':
        form = PrivateUserForm(request.POST, instance=privateUser)
        if form.is_valid():
            form.save()
            return redirect('privateUser-details', privateUser.id)
    else:
        form = PrivateUserForm(instance=privateUser)

    return render(request,
                'config/privateUser_update.html',
                {'form': form})


def privateUserDetails(request, id):
  privateUser = User.objects.get(id=id)
  return render(request,
          'config/privateUser_details.html',
          {'privateUser': privateUser})


 
""" 
For Logout ==> provide :

{
    "Authorization" : "Token <token>"
} 

"""