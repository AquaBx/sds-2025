FROM oven/bun:alpine AS bun

WORKDIR /app

COPY ./travelguide/package*.json ./
RUN bun install

COPY ./travelguide .
RUN bun run build

FROM oven/bun:alpine AS bunprod
WORKDIR /app
EXPOSE 3000
COPY --from=bun /app/build "."

CMD ["bun", "index.js"]