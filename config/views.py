from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from rest_framework.decorators import api_view
from .models import User,Course,Note,Passenger
from .serializers import CourseSerializer, NoteSerializer, PassengerSerializer, UserUpdateSerializer
from django.contrib.auth.hashers import make_password


@api_view(['GET', 'POST'])
def getRoutes(request):
    routes = [
        'GET /api/login',
        'GET/api/logout'
        'GET /api/register',
        ]
    return Response(routes)


# USERS

@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many = True) # many = True because multiple objects
    return Response(serializer.data)


@api_view(['GET'])
def getUser(request, id):
    user = User.objects.get(id=id)
    serializer = UserSerializer(user, many = False)
    return Response(serializer.data)


@api_view(['POST'])
def createUser(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True) # check if valid & raise exception otherwise
    serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
    user = serializer.save() # save user if valid
    return Response({
        "user": UserSerializer(user, many = False).data,
        "token": AuthToken.objects.create(user)[1]
    })

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


@api_view(['POST'])
def updateUser(request, id):

    try: user = User.objects.get(id=id)
    except User.DoesNotExist: return Response({"status": f"No user for id = {id}"})

    serializer = UserUpdateSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        actual_password = serializer.validated_data['password']        
        if actual_password:
            if user.check_password(actual_password):
                serializer.validated_data['password'] = make_password(actual_password)
                user = serializer.save()
            else: return Response({"status": "Invalid actual password provided"})        
        return Response({"status": "User successfully updated", "user": UserSerializer(user, many=False).data})
    else: return Response({"status": "Invalid data provided"})


# COURSES 

@api_view(['GET'])
def getCourses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many = True)
    return Response(serializer.data)


@api_view(['GET'])
def getCourse(request, id):
    course = Course.objects.get(id=id)
    serializer = CourseSerializer(course, many = False)
    return Response(serializer.data)


# PASSENGERS 

@api_view(['GET'])
def getPassengers(request):
    passengers = Passenger.objects.all()
    serializer = PassengerSerializer(passengers, many = True)
    return Response(serializer.data)


@api_view(['GET'])
def getPassenger(request, id):
    passenger = Passenger.objects.get(id=id)
    serializer = PassengerSerializer(passenger, many = False)
    return Response(serializer.data)

# NOTES 

@api_view(['GET'])
def getNotes(request):
    notes = Note.objects.all()
    serializer = NoteSerializer(notes, many = True)
    return Response(serializer.data)


@api_view(['GET'])
def getNote(request, id):
    note = Note.objects.get(id=id)
    serializer = NoteSerializer(note, many = False)
    return Response(serializer.data)