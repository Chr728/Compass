FROM node:18-bullseye-slim

ARG PORT

WORKDIR /app/server

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]
