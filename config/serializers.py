from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User, Course, Passenger, Note

# SERIALIZERS : Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes

# ===> Turn Python objects into Json data


# User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'email','date_joined')

class UserUpdateSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email','password')

# Register Serializer
class RegisterSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id','first_name','last_name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'required':True,
                'write_only': True,
                'style': {'input_type': 'password'}
            },
            'email': {
                'validators': [
                    UniqueValidator(queryset=User.objects.all())
                ]
            }
        }


# OTHERS SERIALIZERS

class CourseSerializer(ModelSerializer):
    class Meta :
        model = Course
        fields = '__all__'

class PassengerSerializer(ModelSerializer):
    class Meta :
        model = Passenger
        fields = '__all__'

class NoteSerializer(ModelSerializer):
    class Meta :
        model = Note
        fields = '__all__'

