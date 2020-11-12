#  Dockerfile for Node Express Backend api 
FROM node:current-alpine3.12
# ARG NODE_ENV=development
# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install Dependencies
COPY package*.json ./
RUN npm i nodemailer
RUN npm i
# Copy app source code
COPY . .
# Exports
EXPOSE 8080
CMD ["npm","start"]