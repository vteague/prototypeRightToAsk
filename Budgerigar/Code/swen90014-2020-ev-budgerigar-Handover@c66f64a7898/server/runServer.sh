#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
START=$(date +%s)

#stop and remove all existing containers
sudo sh stopServer.sh
cd ..

DATABASE_PATH=serviceContainer/database/
DATABASE_DIR=db_data
if [ ! -d "$DATABASE_PATH$DATABASE_DIR" ]; then
    echo -e "${GREEN}"
    echo "Mounting local volume for PostgreSQL Database"
    echo -e "${NC}"
    cd $DATABASE_PATH
    mkdir $DATABASE_DIR/
    sudo docker volume create --name=$DATABASE_DIR
    if [ $? -eq 0 ]; then
        sudo sh cleanRunContainer.sh 1
        cd ../..
        #sleep first time so that postgresql installs before services attempt to connect
        sleep 15
    else
        echo -e "${RED}"
        echo "Failure: Could not mount local volume" >&2
        echo -e "${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}"
    echo "Starting PostgreSQL Container"
    echo -e "${NC}"
    cd serviceContainer/database
    sudo sh cleanRunContainer.sh 1
    cd ../..
fi
# Start apiContainer
echo -e "${GREEN}"
echo "Starting apiContainer"
echo -e "${NC}"
cd apiContainer/
sudo sh cleanRunContainer.sh 1
cd ..
# Start serviceContainer
echo -e "${GREEN}"
echo "Starting serviceContainer"
echo -e "${NC}"
cd serviceContainer/
sudo sh cleanRunContainer.sh 1
# Start Logging Service
echo -e "${GREEN}"
echo "Starting logger"
echo -e "${NC}"
cd ../logger/
sudo sh runLogger.sh &


END=$(date +%s)
DIFF=$(( $END - $START ))
echo "It took $DIFF seconds"
