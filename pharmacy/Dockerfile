FROM node:18

WORKDIR /usr/src/Pharmacyservice

COPY package*.json ./

RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "index.js"]
