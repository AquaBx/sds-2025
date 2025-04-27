//prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import activities from './data/activities.json' assert { type: 'json' };
import cities from './data/cities.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	for (const c of cities) {
		const c2 = await prisma.city.create({
			data: { name: c.name, zipcode: c.zip, country: c.country }
		})
	}

	for (const p of activities) {
		const activity = await prisma.activity.create({
			data: {
				name: p.name,
				location: p.location,
				score: p.score,
				type: {
					connectOrCreate: {
						where: { name: p.type },
						create: { name: p.type }
					}
				},
				address: p.address,
				tags: {
					connectOrCreate: p.tags.map((t: string) => ({
						where: { name: t },
						create: { name: t }
					}))
				},
				city: {
					connect: { id: p.city },
				},
				disableAccessibility: p.disableAccessibility,
				estimatedDuration: p.estimatedDuration,
				openingTime: p.openingTime,
				closingTime: p.closingTime,
				price: p.price,
				currency: p.currency,
				theme: p.theme,
				description: p.description,
				picture: {
					create: p.picture
				},
			}
		});
		console.log(`Created user with id: ${activity.id}`);
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
