ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY . .

WORKDIR /app/travelguide

EXPOSE 4173

RUN npm install
RUN npx prisma migrate dev --name init
RUN npx prisma db push
RUN npm run build

CMD ["npm", "run", "preview"]
