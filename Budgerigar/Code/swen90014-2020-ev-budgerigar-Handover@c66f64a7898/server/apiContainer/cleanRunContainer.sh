#!/bin/sh
sudo sh stop.sh
docker-compose pull
docker-compose build
if [ -z "$1" ]
  then
    docker-compose up --remove-orphans
else
    echo "Launched in background"
    docker-compose up -d --remove-orphans
fi