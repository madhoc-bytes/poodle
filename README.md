# Poodle
Welcome to Poodle! This repository contains the frontend and backend code for the Poodle application. Below you'll find instructions on how to set up the application using Docker and how to run multiple users for testing purposes.

## Setting up Docker
To run the Poodle application using Docker, follow these steps:

1. Go to https://docs.docker.com/engine/install/ and choose your operating system to install Docker Desktop.
2. Unzip the provided source code folder to your preferred location.
3. Open your terminal or command prompt and navigate to the root directory of the unzipped source code.
4. Run the following command to build and start the Docker containers: ```docker-compose up --build```
5. Once the Docker containers are up and running, open your web browser and visit http://localhost:3000/ to access the Poodle application.

## Pre-filled Database
We have provided a pre-filled database in the zip file, which will be automatically loaded when you start the Docker container. This pre-filled data is intended for testing and demonstration purposes. 

If you want to start with an empty database or want to use your own data, you can follow these steps:

1. Delete the instance folder located in poodle/backend.
2. Run the following command to rebuild the Docker containers with an empty database:
```docker-compose up --build```

**Caution:** Please be aware that running the command above will reset the database and any data you previously added will be lost.

## Running Multiple Users
*Note:* When testing multiple users, it's important to use different browsers for each user session. This is because the authentication token used for logging in is stored per browser. You can use browsers like Edge, Chrome, Firefox, or Safari for separate user sessions.