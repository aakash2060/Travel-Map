# Getting Started with Travel Map App

1> First clone the app to a directory
2> For frontend:  Go inside Travel Map directory and in command line enter this command to install all the dependencies: ``` npm install --legacy-peer-deps ```
3> For Backend: 
a. Go inside the Backend folder in Travel Map directory, create a .env file, and copy the content of the .env.example file into your .env file.

b. In your command line enter ``` npm install ``` to install all the dependencies of backend 

## You are Ready To Go

To start the project:

 open three terminals, one for react, one for backend (express) and one for dynamodb local
 1. To run React app Go to Travel-Map directory on your command line and enter ```npm start```.
 2. To run Express app in another terminal, Go inside backend folder on you terminal and enter ```node server.js```.
 3. To run dynamodb local database, in another terminal, Go to Travel-Map directory and on enter ```docker run -p 8000:8000 amazon/dynamodb-local``` on your terminal.
 4. open your localhost:3000 port on web browser to view the app. 
