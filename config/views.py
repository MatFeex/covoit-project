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
    PassengerCreateSerializer,

    NoteSerializer, 
    NoteManageSerializer,
    )



@api_view(['GET'])
def getRoutes(request):
    routes = [
        'GET /api/users/',
        'POST /api/user/login',
        'POST/api/user/logout',
        'POST /api/user/register',
        'GET POST PUT PATCH /api/user/',

        'GET /api/courses/',
        'GET api/courses-user/',
        'GET POST PUT DELETE /api/courses/id',
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
        serializer = PassengerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user'] = request.user
        Passenger = serializer.save()
        return Response(data={"passenger": PassengerSerializer(Passenger, many=False).data}, status=HTTP_201_CREATED)


class PassengerAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_obj(self, request, id):
        try: return Passenger.objects.get(id=id, user = request.user)
        except Passenger.DoesNotExist: raise ValidationError("Passenger id not found OR not associated with athenticated user")

    def get(self, request,id):
        passenger = self.get_obj(request, id)
        serializer = PassengerSerializer(passenger, many=False)
        return Response(serializer.data)
    
    def delete(self, request, id):
         passenger = self.get_obj(request, id)
         passenger.delete()


# NOTES

class NotesAPI(APIView):

    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)


class NotesSomeoneAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get_course_and_rated_user(self, request, course_id, rated_id):
        try:
            course = Course.objects.get(id=course_id)

            if request.user == course.user: raise ValidationError("You cannot rate your own course")

            passenger = Passenger.objects.filter(user=request.user, course=course).first()

            if not passenger:
                if rated_id == request.user.id: raise ValidationError("You cannot rate yourself")
                else: raise ValidationError("You did not attend this course: rating denied")

            if course.user.id == rated_id:  return course, course.user

            else :
                try:
                    rated_user = Passenger.objects.exclude(user=request.user).get(id=rated_id, course=course).user
                    return course, rated_user

                except Passenger.DoesNotExist: raise ValidationError("No passenger found for the provided ID")

        except Course.DoesNotExist:
            raise ValidationError("Course does not exist")
        

    def post(self, request, course_id, rated_id):
        course, rated = self.get_course_and_rated_user(request, course_id, rated_id)
        if not Note.objects.filter(rater=request.user, rated = rated, course = course).exists():
            serializer = NoteManageSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.validated_data['course'] = course
            serializer.validated_data['rater'] = request.user
            serializer.validated_data['rated'] = rated
            note = serializer.save()
            return Response(data={"note": NoteSerializer(note, many=False).data}, status=HTTP_201_CREATED)
        else : raise ValidationError("You can only rate this person once")


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
         Note = self.get_obj(request, id)
         Note.delete()