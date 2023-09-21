FROM node:18-bullseye-slim

ARG SERVER_DEV_PORT

WORKDIR /app/server

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

EXPOSE ${SERVER_DEV_PORT}

CMD ["npm", "run", "dev"]
