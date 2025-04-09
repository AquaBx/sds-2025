import prisma from '$lib/prisma';

export const load = (async () => {
	// 1.

	const response = await prisma.museum.findMany({
		where: { score: true },

		include: { score: true }
	});

	// 2.

	return { feed: response };
}) ;
