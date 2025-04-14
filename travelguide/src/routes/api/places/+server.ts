import { json } from '@sveltejs/kit';
import data from '$lib/data.json';
import type { Place } from '$lib/types';

export const GET = () => {
  return json({ places: data as Place[] });
};
