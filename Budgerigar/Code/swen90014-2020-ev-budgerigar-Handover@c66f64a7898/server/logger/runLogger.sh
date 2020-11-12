#!/bin/sh

BINARY=logger
#cleanup
sudo killall logger
rm bin/$BINARY

#build
export PATH=$PATH:/usr/local/go/bin:/usr/local/go/bin/go
make 

#run
if test -f "bin/$BINARY"; then
    cd bin/
    chmod a+x $BINARY
    cd ..
    echo "starting log service"
    sudo ./bin/$BINARY
fi

