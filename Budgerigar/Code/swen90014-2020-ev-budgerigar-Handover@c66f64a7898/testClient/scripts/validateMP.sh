cd ..

GREEN='\033[0;32m'
NC='\033[0m'

EMAIL="verifyMP.json"
uID="verifyUID.json"

RANDOM=$$
USERNAME=$(head -n 1 username.txt)
TIMESTAMP="0"
echo "Username is $USERNAME"
echo "Timestamp is $TIMESTAMP"

cd rsaServer
if [ ! -d "node_modules/" ]
then
    npm install
fi
killall node
node index.js &
RSASERVERID=$!
echo $RSASERVERID
cd ..

make build
BINARY="./testClient"
PATH="json_files/"

if [ $? -eq 0 ]; then
    echo "Running Test file : $PATH$EMAIL"
    $BINARY $PATH$EMAIL $USERNAME $TIMESTAMP
    echo -e "${GREEN}"
    read -rsp $'UPDATE PATH in uid.json with uid received at MP email, press ANY key to continue...\n' -n1 key
    echo -e "${NC}"
    echo "Running Test file : $PATH$uID"
    $BINARY $PATH$uID $USERNAME $TIMESTAMP
else
  echo "Failed to compile testClient"
  exit 1
fi
