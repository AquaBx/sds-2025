npm install
npx prisma migrate reset --force
npx prisma db push
npx prisma migrate dev --name init
npx prisma db push
npx prisma db seed
node dist