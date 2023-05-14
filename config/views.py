from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from rest_framework.decorators import api_view
from .models import User,Course,Note,Passenger,Evaluation
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError

from django.shortcuts import get_object_or_404
from rest_framework import status


from rest_framework.status import (
    HTTP_401_UNAUTHORIZED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_201_CREATED,
    HTTP_403_FORBIDDEN,
    HTTP_200_OK,
)

from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
    UserPasswordSerializer,

    CourseSerializer, 
    CourseManageSerializer,


    NoteSerializer, 
    PassengerSerializer, 
    UserUpdateSerializer
    )



@api_view(['GET', 'POST'])
def getRoutes(request):
    routes = [
        'GET /api/login',
        'GET/api/logout'
        'GET /api/register',
        ]
    return Response(routes)


# USERS

class UsersAPI(APIView):
    
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserAPI(APIView):
    
    def get_permissions(self):
        if self.request.method == 'POST': return [AllowAny()]
        elif self.request.method in ['GET','PUT','PATCH']: return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
        user = serializer.save()
        return Response(data={"user": UserSerializer(user, many=False).data, "token": AuthToken.objects.create(user)[1]}, status=HTTP_201_CREATED)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(instance=user, data=request.data)
        serializer.is_valid(raise_exception=True)
        actual_password = serializer.validated_data['password']
        if actual_password:
            if user.check_password(actual_password):
                serializer.validated_data['password'] = make_password(actual_password)
                user = serializer.save()
            else: return Response(status=HTTP_401_UNAUTHORIZED)
        return Response(data={"user": UserSerializer(user, many=False).data}, status=HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        serializer = UserPasswordSerializer(instance=user, data=request.data)
        serializer.is_valid(raise_exception=True)
        actual_password = serializer.validated_data['password']
        new_password = serializer.validated_data['new_password']
        if actual_password and new_password:
            if user.check_password(actual_password):
                serializer.validated_data['password'] = make_password(new_password)
                user = serializer.save()
            else: return Response(status=HTTP_401_UNAUTHORIZED)
        return Response(data={"user": UserSerializer(user, many=False).data}, status=HTTP_200_OK)
    


@api_view(['POST'])
def loginUser(request):
    request.data['username'] = request.data['email']
    serializer = AuthTokenSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    login(request, user)
    return KnoxLoginView().post(request, format=None)


# logoutUser : provide in hearders a POST request : 
# {
#     "Authorization" : "Token <token>"
# } 



# COURSES 


class CoursesAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request):
        try: return Course.objects.filter(user=request.user)
        except Course.DoesNotExist: raise ValidationError("No courses founded for this user")

    def get(self, request):
        course = self.get_obj(request)
        serializer = CourseSerializer(course, many=True)
        return Response(serializer.data)
    
class CourseAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request, id):
        try: return Course.objects.get(id=id, user = request.user)
        except Course.DoesNotExist: raise ValidationError("No course for this id")

    def get(self, request,id):
        course = self.get_obj(request, id)
        serializer = CourseSerializer(course, many=False)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CourseManageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = request.user
        course = serializer.save()
        return Response(data={"course": CourseSerializer(course, many=False).data}, status=HTTP_201_CREATED)

    def put(self, request, id):
        course = self.get_obj(request, id)
        serializer = CourseManageSerializer(instance=course, data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response(data={"course": CourseSerializer(course, many=False).data}, status=HTTP_200_OK)
    


class NotePassengerAPI(APIView):

    def post(self, request, course_id, passenger_id):
        course = get_object_or_404(Course, id=course_id)
        passenger = get_object_or_404(Passenger, id=passenger_id, course=course)

        if passenger.user != request.user:
            return Response({"error": "You are not authorized to rate this passenger."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            note = serializer.save(user=request.user)
            passenger.note = note
            passenger.save()

            rating = request.data.get('rating')
            comment = request.data.get('comment')
            evaluation = Evaluation(rater=request.user, ratee=passenger.user, rating=rating, comment=comment)
            evaluation.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)