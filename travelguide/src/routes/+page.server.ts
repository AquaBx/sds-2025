import prisma from '$lib/prisma';

export const load = async () => {
	// 1.

	const response = await prisma.activity.findMany({
		where: {
			score: {
				gte: 3 // Example condition for filtering by score
			}
		},
		include: {
			picture: true // Include related pictures
		}
	});

	// 2.

	return { feed: response };
};
