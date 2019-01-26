FROM node:8.15.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 4400 3000
RUN cd /usr/src/app
CMD [ "npm", "start" ]