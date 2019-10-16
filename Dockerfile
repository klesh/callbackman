FROM node:10

MAINTAINER klesh@malong.com

RUN mkdir -p /app
WORKDIR /app
COPY public /app/public
COPY index.js /app
COPY package.json /app

RUN yarn
EXPOSE 3000
