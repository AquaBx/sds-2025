import type { Load } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.DATABASE);

export const load: Load = async () => {
    const cities = await pb.collection('cities').getFullList();
    const tags = await pb.collection('tags').getFullList();
    const types = await pb.collection('types').getFullList();
    return { cities, tags, types };
}