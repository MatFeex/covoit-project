from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User
from django.contrib.auth.hashers import make_password

# SERIALIZERS : Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'email','date_joined')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    
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


    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password']) # hash the password before saving user in database
        user = User.objects.create(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance
