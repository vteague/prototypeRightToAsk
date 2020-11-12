cd ..
GREEN='\033[0;32m'
NC='\033[0m'

images=$(sudo docker ps -a -q)
echo "${GREEN} \n\t\tService Network ${NC}"
echo "ImageName : IP\n" 
for i in $images;
do
	sudo docker inspect $i --format '{{json .Config.Image}} {{json .NetworkSettings.Networks.service_nw.IPAddress}}'
done
echo "---------------------------------------------------------------------------------------------------------"
echo "${GREEN} \n\t\tDatabase Network ${NC}"
echo "ImageName : IP\n" 
for i in $images;
do
	sudo docker inspect $i --format '{{json .Config.Image}} {{json .NetworkSettings.Networks.database_nw.IPAddress}}'
done

echo " "
echo "${GREEN}Following containers are running${NC}"

sudo docker ps -a --format 'table {{.Names}}''\t''{{.Ports}}'
echo " "