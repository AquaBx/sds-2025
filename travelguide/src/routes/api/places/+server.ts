import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.DATABASE);

export const GET = async () => {
  const places = await pb.collection('activities').getFullList();

  for (let p of places) {
    p.picture = `${process.env.DATABASE}/api/files/activities/${p.id}/${p.picture}`
  }
  return json({ places: places });
};