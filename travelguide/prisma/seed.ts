//prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import userData from '../src/lib/data.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	for (const p of userData) {
		const user = await prisma.activity.create({
			data: {
                name : p.name,
                location : p.location,
                score : p.score,
				type : p.type,
				disableAccessibility : p.disableAccessibility,
				estimatedDuration : p.estimatedDuration,
				price : p.price,
				currency : p.currency,
				theme : p.theme,
				description : p.description,
				picture : {
					create: p.picture
				},
			}
		});
		console.log(`Created user with id: ${user.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
