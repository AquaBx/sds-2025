import { json } from '@sveltejs/kit';
import data from '$lib/data.json';
import type { Place } from '$lib/types';
import type { RequestHandler } from './$types';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isOpenDuring(visitStart: number, visitEnd: number, place: Place) {
  const open = timeToMinutes(place.openingTime);
  const close = timeToMinutes(place.closingTime);
  return open <= visitStart && visitEnd <= close;
}

export const POST: RequestHandler = async ({ request }) => {
  const { interests, budget, start, end } = await request.json();

  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  const totalAvailable = endMinutes - startMinutes;

  let remainingBudget = budget;
  let currentTime = startMinutes;
  const guide: { place: Place; from: string; to: string }[] = [];

  const candidates = (data as Place[])
    .filter(place =>
      place.tags?.some(tag => interests.includes(tag)) &&
      place.price <= remainingBudget &&
      place.estimatedDuration * 60 <= (endMinutes - currentTime) &&
      isOpenDuring(currentTime, currentTime + place.estimatedDuration * 60, place)
    )
    .sort((a, b) => b.score - a.score);

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
