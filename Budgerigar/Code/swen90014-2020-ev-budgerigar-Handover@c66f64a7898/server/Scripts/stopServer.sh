#!/bin/bash

cd ..

echo "Taking backup of nginx-logs"
cd logger
./logBackup.sh
cd ../


cd serviceContainer/database
sudo sh stop.sh
cd ../..
cd apiContainer/
sudo sh stop.sh
cd ..
cd serviceContainer/
sudo sh stop.sh
cd ..
IMAGES=$(sudo docker ps -a -q | wc -l)
if [ ! $IMAGES -eq 0 ]; then
    echo "Stopping all running images"
    sudo docker stop $(docker ps -a -q)
    sudo docker rm $(docker ps -a -q)
fi
