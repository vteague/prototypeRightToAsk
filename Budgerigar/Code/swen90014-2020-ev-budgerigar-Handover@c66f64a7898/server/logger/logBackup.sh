#!/bin/bash

GEN_LOGS=logs/
[ ! -d $GEN_LOGS ] && mkdir $GEN_LOGS
cd $GEN_LOGS && rm *.log
NAMES=$(sudo docker ps -a --format '{{.Names}}')
for i in $NAMES; do
	sudo docker logs $i > $i.log   
done
NOW=$(date +"%m-%d-%Y:%H:%M:%S")_logs

[ ! -d ~/SERVER_LOGS_BACKUP ] && mkdir ~/SERVER_LOGS_BACKUP
LOGS_DIR=$NOW
mkdir ~/SERVER_LOGS_BACKUP/$LOGS_DIR/
for filename in *.log; do
	cp $filename ~/SERVER_LOGS_BACKUP/$LOGS_DIR/
done
