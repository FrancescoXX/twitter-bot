FROM node:14

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "src/index.js"]