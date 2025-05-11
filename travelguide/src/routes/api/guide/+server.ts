import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { Activity } from '@prisma/client';

function timeToMinutes(time: string): number {
  if (time == null) { return 0 }
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isOpenDuring(visitStart: number, visitEnd: number, place: Activity) {
  if (place.openingTime === null || place.closingTime === null) return true

  const open = timeToMinutes(place.openingTime);
  const close = timeToMinutes(place.closingTime);
  return open <= visitStart && visitEnd <= close;
}

export const POST: RequestHandler = async ({ request }) => {
  const { interests, budget, start, end, disability } = await request.json();

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const totalAvailable = endMinutes - startMinutes;

  let remainingBudget = budget;
  let currentTime = startMinutes;
  const guide: { place: Activity; from: string; to: string }[] = [];

  const candidates = await prisma.activity.findMany({
    where: {
      tags: {
        some: {
          name: {
            in: interests,
          },
        },
      },
      ...(disability ? { disableAccessibility: true } : {})
    },
    orderBy: {
      score: 'desc',
    },
    include: {
      picture: true,
    },
  });

  for (const place of candidates) {
    const duration = place.estimatedDuration * 60;
    const visitEnd = currentTime + duration;

    if (
      visitEnd <= endMinutes &&
      remainingBudget - place.price >= 0 &&
      isOpenDuring(currentTime, visitEnd, place)
    ) {
      guide.push({
        place,
        from: minutesToTime(currentTime),
        to: minutesToTime(visitEnd),
      });

      currentTime = visitEnd;
      remainingBudget -= place.price;
    }
  }

  return json({ itinerary: guide });
};

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
