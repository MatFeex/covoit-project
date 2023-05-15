from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import User, Course, Passenger, Note
from rest_framework.serializers import SerializerMethodField, CharField

# SERIALIZERS : Serializers allow complex data such as querysets and model instances to be converted to native Python datatypes

# ===> Turn Python objects into Json data


# User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'email','date_joined')

class UserCreateSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email','password')

class UserUpdateSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email','password')

class UserPasswordSerializer(ModelSerializer):
    new_password = CharField(required=True)

    class Meta:
        model = User
        fields = ('email','password','new_password')

# OTHERS SERIALIZERS

class CourseSerializer(ModelSerializer):
    passenger_count = SerializerMethodField(read_only=True)

    def get_passenger_count(self,obj):
        return obj.passenger_set.count()
    
    class Meta :
        model = Course
        fields = '__all__'

class CourseManageSerializer(ModelSerializer):
    class Meta :
        model = Course
        fields = ('start','end','date','status')

# PASSENGERS

class PassengerSerializer(ModelSerializer):
    class Meta :
        model = Passenger
        fields = '__all__'

class PassengerManageSerializer(ModelSerializer):
    class Meta :
        model = Passenger
        fields = '__all__'



# NOTES

class NoteSerializer(ModelSerializer):
    class Meta :
        model = Note
        fields = '__all__'

class NoteManageSerializer(ModelSerializer):
    class Meta :
        model = Note
        fields = ('note','comment')
