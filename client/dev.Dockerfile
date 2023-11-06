FROM node:18-bullseye-slim

WORKDIR /app/client

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

CMD ["npm", "run", "start"]
