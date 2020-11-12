#!/bin/bash

SSL_CERT_DIR='/etc/letsencrypt/live/yam1.eastus.cloudapp.azure.com/'
SERVER_ROOT_DIR=$1
PRIVKEY='privkey.pem'
FULLCHAIN='fullchain.pem'
SERVER='server/'
API_CONTAINER_DIR='apiContainer/'
SCRIPTS='scripts'
SSL_TARGET="nginx/
register/
sync/
write/
../logger/"

if [ ! -d $SSL_CERT_DIR ]; then
    echo "SSL certificates not found at $SSL_CERT_DIR"
    exit 1

fi

cd $SERVER_ROOT_DIR
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

if [ ! -f "$SSL_CERT_DIR$PRIVKEY" ]; then
    echo "${RED}$SSL_CERT_DIR$PRIVKEY${NC} does not exist."
    exit 1
fi
if [ ! -f "$SSL_CERT_DIR$FULLCHAIN" ]; then
    echo "${RED}$SSL_CERT_DIR/$FULLCHAIN${NC} does not exist."
    exit 1
fi

cd $SERVER_ROOT_DIR$API_CONTAINER_DIR
for TARGET in $SSL_TARGET;do
    cp $SSL_CERT_DIR$PRIVKEY $TARGET
    cp $SSL_CERT_DIR$FULLCHAIN $TARGET
done
echo "Copied SSL certificates "
echo "from: ${SSL_CERT_DIR} "
echo "to ${SERVER_ROOT_DIR}"
echo " "
exit 0