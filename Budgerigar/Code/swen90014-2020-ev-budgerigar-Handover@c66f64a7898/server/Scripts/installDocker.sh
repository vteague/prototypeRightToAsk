cd ../../

#remove if any exist
sudo apt-get remove docker docker-engine docker.io containerd runc

#download docker installation script
#sudo apt-get update 
sudo apt install curl
curl -fsSL https://get.docker.com -o get-docker.sh
#run docker installation script
sudo sh get-docker.sh

echo ""
docker -v

