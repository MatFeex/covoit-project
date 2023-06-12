from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import User, Course, Passenger, Note
from rest_framework.serializers import SerializerMethodField, CharField, ValidationError

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
        partial = True

class UserPasswordSerializer(ModelSerializer):
    new_password = CharField(required=True)

    class Meta:
        model = User
        fields = ('password','new_password')

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
        fields = ('start','end','date','status','vehicle_brand','vehicle_model','vehicle_seats')
        partial = True

# PASSENGERS

class PassengerSerializer(ModelSerializer):
    class Meta :
        model = Passenger
        fields = '__all__'

class PassengerManageSerializer(ModelSerializer):
    
    class Meta :
        model = Passenger
        fields = ('course',)
        partial = True

    def create(self, validated_data):
        instance = super().create(validated_data)
        course = validated_data.get('course')
        seats_available = course.vehicle_seats - course.passenger_set.count()
        if seats_available == 0 : 
            course.status = 'Validée'
            course.save()       
        return instance

    def validate(self, data):
        user = self.context['request'].user
        course = data['course']
        seats_available = course.vehicle_seats - course.passenger_set.count()

        # Availability validation
        if not seats_available > 0 : raise ValidationError("No seats available for this course.")

        # Unique passenger validation
        if Passenger.objects.filter(user=user, course=course).exists():
            raise ValidationError("You cannot join a course twice.")

        # A passenger cannot be the driver
        if Course.objects.filter(id=course.id, user=user).exists():
            raise ValidationError("You cannot join your own course.")

        return data



# NOTES

class NoteSerializer(ModelSerializer):
    class Meta :
        model = Note
        fields = '__all__'

class NoteManageSerializer(ModelSerializer):
    class Meta :
        model = Note
        fields = ('note','comment')
        partial = True
