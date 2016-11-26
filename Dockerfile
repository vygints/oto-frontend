FROM node:latest
MAINTAINER Anton Weiss <ant.weiss@gmail.com>
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent
COPY . /usr/src/app
COPY prod.env /usr/src/app/.env
CMD [ "npm", "start" ]
