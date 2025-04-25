import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET = async () => {
  const places = await prisma.activity.findMany({
    include: {
      picture: true,
    },
  })
  return json({ places: places });
};
