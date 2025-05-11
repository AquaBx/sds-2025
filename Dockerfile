FROM node:24.0-slim AS node

WORKDIR /app

COPY ./travelguide/package*.json ./
RUN npm install

COPY ./travelguide .
RUN npx prisma generate
RUN npm run build

FROM node:24.0-slim AS nodeprod
WORKDIR /app
EXPOSE 3000
COPY ./travelguide/package*.json ./
COPY ./start.sh ./
RUN npm install --omit=dev
COPY ./travelguide/prisma "/app/prisma"
COPY --from=node /app/build "/app/dist"

CMD ["./start.sh"]