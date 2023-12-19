FROM node:18-bullseye-slim AS server_production

ARG PORT
ARG PORT
ENV PORT ${PORT}
ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}
ENV NODE_ENV production

WORKDIR /app/server/

COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/serviceAccountKey.json ./

RUN npm ci

COPY server/ ./

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "prod"]
