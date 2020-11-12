#### SWEN90014 Masters Software Project
# Secure Mobile MP Question Ranker (SMMPQR) 

The mobile client is written completely in React Native. It communicates with a server using RestApi over https.

The server represents a set of containerised Nodejs/Express microservices.

PostgreSql database runs on the server and is accessible through certain microservices.

## Client setup 

Development and testing will utilise the expo-cli utility. 

	npm install expo-cli --global
	
Inside the client directory, run

	npm install 
	npm start
	
The first start will take a few minutes to install and setup expo-cli. Wait for terminal to display appropraite message

There a 3 ways to run the mobile application

1.	Adroid/OSx emulator

	-	Download Google android studio, create a new AVD and run AVD in background prior to npm start
	-	Download xcode 

2. 	Web browser (not recommended)

	-	Click 'launch in browser' from the expo manager screen that comes up after npm start
	
3.	Mobile device
	
	-	Create account with expo, download expo app on mobile and login.
	-	Scan qr code from the expo manager screen and wait for app to load

## Server setup

Docker and Docker-compose should be installed on the system

    ./installDocker-compose.sh
    ./installDocker.sh

Database will be automatically mounted with import relevant .sql file to create server database tables 
to the server filesystem for data to be persist between Docker restarts. Initially the database is empty. 

To start the entire set of services run the following from inside server/ directory
    
    - runServer.sh  -> starts all services
    - stopServer.sh -> stops all services

    
The above commands executes 'docker-compose' inside each of the 'Api-container/', 'service-container/' and 'service-container/Database 'folders. All services automatically start in the background.

For development, an extension to manage PostgreSQL has been added called 'Adminer'. 
To access PostgreSQL through Adminer -> 
	
	Adminer			: localhost:8080
	database 		: postgresql
	host	 		: db 
	POSTGRES_USER		: user1
	POSTGRES_PASSWORD	: Password123!
	POSTGRES_DB		: database-1

### 3 API endpoints available : 	
	https://server-ip/register/user
Register API    -> Register service                                 -> Database
    
	https://server-ip/write/user
Write API       -> Sign/Verification Service    -> Write service    -> Database
    
	https://server-ip/sync/user
Synchronize API -> Sign/Verification Service    -> Sync service     -> Database

### Logs for the server, start the logging service
	
	sudo ./runLogger.sh


