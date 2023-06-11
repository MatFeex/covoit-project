# covoit-project
Covoiturage EPF

To run the Django project:

1. Install the required dependencies:
`pip install -r requirements.txt`

2. Start the server:
`python manage.py runserver`

The project will be accessible at [localhost:8000/api/routes/](http://localhost:8000/api/routes/).

--

## REQUEST DOCUMENTATION

### APP URLs

- GET /api/users/
- POST /api/user/login
- POST /api/user/logout
- POST /api/user/register
- GET POST PUT PATCH /api/user/
- GET /api/courses/
- GET POST PUT DELETE /api/courses/id

---

FOR AUTHENTICATION: Provide the following in the request header

- Key: Authorization
- Value: Token <token>

---

## USERS

### Get Users

- URL: GET http://localhost:8000/api/users/

--

### USER LOGIN

- URL: POST http://localhost:8000/api/user/login/
- Request body:
{
"email": "john.doe@email.fr",
"password": "admin123"
}
--

### USER LOGOUT

- URL: POST http://localhost:8000/api/user/logout/
- AUTHENTICATION NEEDED
- No content response if successful

--

### USER REGISTER

- URL: POST http://localhost:8000/api/user/
- Request body:  
{
"first_name": "John",
"last_name": "Doe",
"email": "john.doe@email.fr",
"password": "admin123"
}  
AUTHENTICATION NEEDED for GET & PUT

--

### UPDATE USER
- AUTHENTICATION NEEDED
- URL: PUT http://localhost:8000/api/user/
- Request body (update a user but not the password):  

{
"first_name": "John 2",
"last_name": "Doe 2",
"email": "john.doe2@email.fr"
"password":"admin123"
}  

### UPDATE USER PASSWORD
- AUTHENTICATION NEEDED
- URL: PATCH http://localhost:8000/api/user/
- Request body (update the password):  

{
"password":"admin123",
"new_password":"admin1234"
}  

--

### GET AUTHENTICATED USER

- URL: GET http://localhost:8000/api/user/
- AUTHENTICATION NEEDED

--

## COURSES

### Get Courses

- URL: GET http://localhost:8000/api/courses/

--

### COURSES USER

- URL: GET http://localhost:8000/api/courses-user/
- AUTHENTICATION NEEDED for GET & POST

--

### CREATE COURSE

- URL: POST http://localhost:8000/api/courses-user/
- Request body:  
{
"start": "Monoprix Bourg La Reine",
"end": "EPF Cachan",
"vehicle_brand":"Porsche",
"vehicle_model":"Cayenne",
"vehicle_seats":4,
"date": "2023-05-15T23:18:32.530856Z",
"status": "En attente de passagers"
}  

--

### COURSE

- URL: GET/PUT/DELETE http://localhost:8000/api/courses/id
- AUTHENTICATION NEEDED for GET, PUT, DELETE

#### GET COURSE

- URL: GET http://localhost:8000/api/courses/id

#### UPDATE COURSE

- URL: PUT http://localhost:8000/api/courses/id
- Request body:  

{
"start": "Monoprix Bourg La Reine",  
"end": "EPF Cachan",  
"vehicle_brand":"Porsche",  
"vehicle_model":"Cayenne",  
"vehicle_seats":4,  
"date": "2023-05-15T23:18:32.530856Z",  
"status": "Validée"  
}  

#### DELETE COURSE

- URL: DELETE http://localhost:8000/api/courses/id
- Empty body  

### ALL PASSENGERS

- URL: GET http://localhost:8000/api/passengers/


#### PASSENGERS FROM authenticated user
- AUTHENTICATION NEEDED for GET, POST

- URL: GET http://localhost:8000/api/passengers-user/

- URL : POST : become passenger of a course (ex : course id 1)

    {
        "course": 1
    }

#### PASSENGER FROM id
- AUTHENTICATION NEEDED

- URL: GET, PUT, DELETE http://localhost:8000/api/passengers/id/

- PUT :

    {
        "course": 1
    }
