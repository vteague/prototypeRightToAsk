#!/bin/bash

cd ..
cd serviceContainer/databaseTest/
mkdir db_data/
sudo docker volume create --name=db_data