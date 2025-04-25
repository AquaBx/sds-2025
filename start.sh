cd travelguide
npx prisma migrate dev --name init
npx prisma db push
npm run dev;
