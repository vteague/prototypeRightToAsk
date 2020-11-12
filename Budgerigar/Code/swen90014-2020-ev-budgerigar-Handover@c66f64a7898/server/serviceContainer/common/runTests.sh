DB_TEST_CONTAINER=db-test
ADMINER_TEST_CONTAINER=adminer-test
DB_CONTAINER=db
ADMINER_CONTAINER=adminer
echo "Running tests"

if [ "x$(which docker)" == "x" ]; then
  echo "UNKNOWN - Missing docker binary"
  exit 3
fi

docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "UNKNOWN - Unable to talk to the docker daemon"
  exit 3
fi

DB_TEST_RUNNING=$(docker inspect --format="{{.State.Running}}" $DB_TEST_CONTAINER 2> /dev/null)
ADMINER_TEST_RUNNING=$(docker inspect --format="{{.State.Running}}" $ADMINER_TEST_CONTAINER 2> /dev/null)

DB_RUNNING=$(docker inspect --format="{{.State.Running}}" $DB_CONTAINER 2> /dev/null)
ADMINER_RUNNING=$(docker inspect --format="{{.State.Running}}" $ADMINER_CONTAINER 2> /dev/null)


if [ "$DB_TEST_RUNNING" == "true" ]; then
    echo "db-test container running"
fi

if [ "$DB_TEST_RUNNING" == "false" ] || [ "$DB_TEST_RUNNING" == "" ] || [ "$ADMINER_TEST_RUNNING" == "false" ]; then
    echo "db-test container/adminer not started"

    if [ "$DB_RUNNING" == "true" ]; then
        echo "Error: db is running"
        echo "Stopping db container..."
        docker stop db
        echo "db container stopped"
    fi

    if [ "$ADMINER_RUNNING" == "true" ]; then
        echo "Error: adminer is running"
        echo "Stopping adminer..."
        docker stop adminer
        echo "adminer container stopped"
    fi

    echo "Changing directory to /databaseTest"
    cd ../databaseTest
    echo "Starting db-test container"
    sh ./cleanRunContainer.sh 1
    echo "Changing directory to /common"
    cd ../common
fi

DB_TEST_RUNNING=$(docker inspect --format="{{.State.Running}}" $DB_TEST_CONTAINER 2> /dev/null)

if [ "$DB_TEST_RUNNING" == "true" ]; then
    echo "Ready to start test suite"
    npm test;
fi

if [ "$DB_TEST_RUNNING" == "false" ]; then
    echo "CRITICAL - $DB_TEST_CONTAINER is not running."
    exit 2
fi