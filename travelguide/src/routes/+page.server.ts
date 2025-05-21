import type { Actions, Load } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.DATABASE);

export const load: Load = async () => {
    const cities = await pb.collection('cities').getFullList();
    const tags = await pb.collection('tags').getFullList();
    const types = await pb.collection('types').getFullList();
    return { cities, tags, types };
}

export const actions: Actions = {
    guide: async (event) => {
        const formData = await event.request.formData();
        console.log(formData)

        return {
            activities
        }
    },

    search: async (event) => {
        const formData = await event.request.formData();
        const interests = (formData.get("tags") || "").split(",")
        const search = (formData.get("search") || "")
        const hourRange = (formData.get("hourRange") || "00,24").split(",").map(h => h.length === 1 ? `0${h}` : h);
        const maxPrice = (formData.get("maxPrice") || 1000)

        const activities = await pb.collection('activities').getFullList({
            filter: `(${interests.map(tag => `tags?~'${tag}'`).join('||')})&&(description~'${search}'||name~'${search}')&&(price<${maxPrice})&&(openingTime<=${hourRange[0]})&&(closingTime>=${hourRange[1]})`
        });

        for (const p of activities) {
            p.picture = `${process.env.DATABASE}/api/files/activities/${p.id}/${p.picture}`
        }

        return {
            activities
        }
    }
}
