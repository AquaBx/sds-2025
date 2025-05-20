import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.DATABASE);

export const GET = async () => {
  const cities = await pb.collection('cities').getFullList();
  return json({ cities: cities });
};