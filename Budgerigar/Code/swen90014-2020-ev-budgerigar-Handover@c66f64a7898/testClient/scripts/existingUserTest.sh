cd ..

GREEN='\033[0;32m'
NC='\033[0m'

TEST_JSON="postQuestion.json
postAnswer.json
postLink.json
sync.json"


RANDOM=$$
USERNAME=$(head -n 1 username.txt)
TIMESTAMP=$(head -n 1 synctimeStamp.txt)
echo "Username is $USERNAME"
echo "Timestamp is $TIMESTAMP"
if [ -z "$TIMESTAMP" ]; then
  echo "Empty SyncTimeStamp"
  exit 1
fi

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

if [ $? -eq 0 ]
then
  for jsonFile in $TEST_JSON; do
    echo ""
    LOGFILE=$jsonFile$LOG
    echo "Running Test file : $PATH$jsonFile"
    $BINARY $PATH$jsonFile $USERNAME $TIMESTAMP
  done
else
  echo "Failed to compile testClient"
  exit 1
fi
