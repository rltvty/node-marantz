FROM node:6.14-alpine

EXPOSE 3002

WORKDIR /home/node/app

COPY package.json ./

RUN npm install

COPY . ./

CMD npm start
