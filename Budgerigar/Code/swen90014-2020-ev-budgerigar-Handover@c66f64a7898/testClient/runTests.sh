
GREEN='\033[0;32m'
NC='\033[0m'

echo "deleting previous test logs"
rm json_files/keys.json username.txt synctimeStamp.txt
rm -rf logs && mkdir logs

echo -e "${GREEN}"
echo "Generating new Username and key pair......."

REGISTRATION_JSON="registrationUser.json"
TEST_JSON="postQuestion.json
postAnswer.json
postLink.json
sync.json"

RANDOM=$$
USERNAME="testUser"$RANDOM
echo "Username is $USERNAME"
TIMESTAMP="0"

echo -e "${NC}"
rm username.txt
echo $USERNAME >> username.txt

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

if [ $? -eq 0 ] ;then
  rm json_files/keys.json
  curl http://localhost:3001/keys  | json_pp  >> json_files/keys.json
  echo -e "${GREEN}"
  echo "Keys generated in json_files/keys.json"
  echo "Registering user...."
  echo -e "${NC}"
  BINARY="./testClient"
  PATH="json_files/"
  echo ""
  echo "Running registration file : $PATH$REGISTRATION_JSON"
  $BINARY $PATH$REGISTRATION_JSON $USERNAME $TIMESTAMP
  echo -e "${GREEN}"
  echo "Registered a new user with username $USERNAME, keys are in json_files/keys.json"
  echo "Now testing following .json files"
  for jsonFile in $TEST_JSON; do
    echo $jsonFile
  done
  read -rsp $'\nPress ANY key to continue...\n' -n1 key
  echo -e "${NC}"
  for jsonFile in $TEST_JSON; do
    echo ""
    echo "Running Test file : $PATH$jsonFile"
    $BINARY $PATH$jsonFile $USERNAME $TIMESTAMP
  done
else
  echo "Failed to compile testClient"
  kill -9 $RSASERVERID
  exit 1
fi
kill -9 $RSASERVERID