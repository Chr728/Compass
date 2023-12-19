FROM node:18-bullseye-slim AS server_production

ARG PORT
ENV PORT ${PORT}
ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}
ARG VAPID_PUBLIC_KEY
ENV VAPID_PUBLIC_KEY ${VAPID_PUBLIC_KEY}
ARG VAPID_PRIVATE_KEY
ENV VAPID_PRIVATE_KEY ${VAPID_PRIVATE_KEY}
ENV NODE_ENV production

WORKDIR /app/server/

COPY server/package*.json ./
COPY server/tsconfig.json ./

RUN npm ci

COPY server/ ./

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "prod"]
