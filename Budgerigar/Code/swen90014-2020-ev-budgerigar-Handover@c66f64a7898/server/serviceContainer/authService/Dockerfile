FROM node:current-alpine3.12
RUN mkdir -p /usr/src/app/common
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install pg
RUN npm install
#RUN npm ci
COPY . .
EXPOSE 9080
CMD ["npm", "run", "start-docker"]
