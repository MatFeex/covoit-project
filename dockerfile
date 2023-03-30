# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 8000

# Define environment variable for the Django app
# ENV DJANGO_SETTINGS_MODULE=myproject.settings

RUN python manage.py migrate

# Start the Django app with the command "python manage.py runserver"
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]