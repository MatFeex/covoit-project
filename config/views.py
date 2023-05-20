from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.db.models import Q

from rest_framework.decorators import api_view
from .models import User,Course,Note,Passenger
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError

from django.shortcuts import get_object_or_404


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

    PassengerSerializer,
    PassengerManageSerializer,

    NoteSerializer, 
    NoteManageSerializer,
    )



@api_view(['GET'])
def getRoutes(request):
    routes = [

        'GET /api/users/',
        'POST /api/user/login',
        'POST/api/user/logout',
        'GET POST PUT PATCH /api/user/',

        'GET /api/courses/',
        'GET api/courses-user/',
        'GET POST PUT DELETE /api/courses/id',

        'GET api/passengers/',
        'GET POST api/passengers-user/',
        'GET PUT DELETE api/passengers/<int:id>/',

        'GET api/notes/',
        'POST api/notes/<int:id>/',
        'GET PUT DELETE api/notes/courses/<int:course_id>/user-rated/<int:rated_id>/'

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

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    


class CoursesUserAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request):
        try: return Course.objects.filter(user=request.user)
        except Course.DoesNotExist: raise ValidationError("No courses founded for this user")

    def get(self, request):
        course = self.get_obj(request)
        serializer = CourseSerializer(course, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CourseManageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = request.user
        course = serializer.save()
        return Response(data={"course": CourseSerializer(course, many=False).data}, status=HTTP_201_CREATED)

    

class CourseAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request, id):
        try: return Course.objects.get(id=id, user = request.user)
        except Course.DoesNotExist: raise ValidationError("Authenticated user has no course for this id")

    def get(self, request,id):
        course = self.get_obj(request, id)
        serializer = CourseSerializer(course, many=False)
        return Response(serializer.data)
    
    def put(self, request, id):
        course = self.get_obj(request, id)
        serializer = CourseManageSerializer(instance=course, data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return Response(data={"course": CourseSerializer(course, many=False).data}, status=HTTP_200_OK)
    
    def delete(self, request, id):
        course = self.get_obj(request, id)
        course.delete()
        return Response(data={"detail": f"The course {id} has been deleted"}, status=HTTP_200_OK)

    

# PASSENGERS 

class PassengersAPI(APIView):

    def get(self, request):
        passengers = Passenger.objects.all()
        serializer = PassengerSerializer(passengers, many=True)
        return Response(serializer.data)
    

class PassengersUserAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request):
        try: return Passenger.objects.filter(user=request.user)
        except Passenger.DoesNotExist: raise ValidationError("This user has never been a passenger.")

    def get(self, request):
        passengers = self.get_obj(request)
        serializer = PassengerSerializer(passengers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PassengerManageSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = request.user        
        passenger = serializer.save()
        return Response(data={"passenger": PassengerSerializer(passenger, many=False).data}, status=HTTP_201_CREATED)


class PassengerAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request, id):
        try: return Passenger.objects.get(id=id, user = request.user)
        except Passenger.DoesNotExist: raise ValidationError(f"Passenger not found for id {id} OR not associated with athenticated user")

    def get(self, request,id):
        passenger = self.get_obj(request, id)
        serializer = PassengerSerializer(passenger, many=False)
        return Response(serializer.data)
    
    def put(self, request, id):
        passenger = self.get_obj(request, id)
        serializer = PassengerManageSerializer(instance=passenger, data=request.data)
        serializer.is_valid(raise_exception=True)
        passenger = serializer.save()
        return Response(data={"passenger": PassengerSerializer(passenger, many=False).data}, status=HTTP_200_OK)
    
    def delete(self, request, id):
        passenger = self.get_obj(request, id)
        passenger.delete()
        return Response(data={"detail": f"The passenger {id} has been deleted"}, status=HTTP_200_OK)


# NOTES

class NotesAPI(APIView):

    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

class NotesSomeoneAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, rated_id):
        # Retrieve all notes for the given course and rated user
        notes = Note.objects.filter(course_id=course_id, rated_id=rated_id)
        serializer = NoteManageSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request, course_id, rated_id):
        serializer = NoteManageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Ensure the rater is the current authenticated user
        rater = request.user

        # Check if the rater is not the rated
        if rater.id == rated_id :  return Response("Rating denied : You cannot rate yourself.", status=HTTP_400_BAD_REQUEST)

        course = Course.objects.get(id=course_id)

        if course.user_id == rater.id : # the rater is the driver
            
            if not rated_id in rater.passenger_set.filter(course_id=course_id).values_list('user_id', flat=True): # 
                return Response("Rating denied : the rated person did not attend to your course.", status=HTTP_400_BAD_REQUEST)
        
        elif rater.id in course.passenger_set.filter(course_id=course_id).values_list('user_id', flat=True) : # the rater is a passenger
            if not rated_id == course.user_id :
                return Response("Rating denied : As a passenger, you can only rate your driver.", status=HTTP_400_BAD_REQUEST)
        else : return Response("Rating denied : You cannot rate a course in which you did not attend.", status=HTTP_400_BAD_REQUEST)


        # Set the course and rated user IDs in the serializer data
        serializer.validated_data['course_id'] = course_id
        serializer.validated_data['rated_id'] = rated_id
        serializer.validated_data['rater'] = rater

        # Create the note
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)


class NoteAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request, id):
        try: return Note.objects.get(id=id, rater = request.user)
        except Note.DoesNotExist: raise ValidationError("Authenticated user has no note for this ID")

    def get(self, request,id):
        note = self.get_obj(request, id)
        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data)
    
    def put(self, request, id):
        note = self.get_obj(request, id)
        serializer = NoteManageSerializer(instance=note, data=request.data)
        serializer.is_valid(raise_exception=True)
        note = serializer.save()
        return Response(data={"Note": NoteSerializer(note, many=False).data}, status=HTTP_200_OK)
    
    def delete(self, request, id):
        note = self.get_obj(request, id)
        note.delete()
        return Response(data={"detail": f"The note {id} has been deleted"}, status=HTTP_200_OK)
