FROM node:8

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

CMD ["node", "server.js"]