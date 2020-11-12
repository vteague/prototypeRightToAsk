#!/bin/bash

#Run with sudo / as root

APP_ROOT_DIR="$(cd ../.. && pwd)/"
SERVER_DIR="server/"
SCRIPTS_DIR="Scripts/"
SSL="installSSLCerts.sh"

echo "Installing server and mounting PostgreSQL volume to: "
echo $APP_ROOT_DIR
read -r "Press any key to continue...." key

cd $APP_ROOT_DIR$SERVER_DIR$SCRIPTS_DIR
sudo ./installSSLCerts.sh $APP_ROOT_DIR$SERVER_DIR