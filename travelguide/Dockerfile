ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

COPY . .

EXPOSE 4173

RUN npm install

CMD npx prisma migrate dev --name init \
     && npx prisma db push \
     && npm run build \
     && npm run preview
