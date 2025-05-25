import { Agent } from '$lib/Agent';
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

        const interests = (formData.get("tags") || "").split(",")
        const budget = formData.get("budget")!
        const currency = formData.get("currency")!
        const startDate = formData.get("startDate")!
        const endDate = formData.get("endDate")!
        const disability = formData.get("disability") == "on"
        const city = formData.get("city")!

        const activities = await pb.collection('activities').getFullList({
            filter: `(${interests.map(tag => `tags?~'${tag}'`).join('||')})&&(city='${city}')${disability ? "" : "&&(disableAccessibility=True)"}`,
        });

        const agent1 = new Agent("Group activities by geographical areas, ensuring they align with the number of days the person will stay. Optimize for convenience and logical flow.", [["id", "number (id of the activity)"], ["duration", "number (activity duration in hour)"]])
        agent1.provideData("Filtered activites available", activities)
        agent1.provideData("Start of stay", startDate)
        agent1.provideData("End of stay", endDate)
        agent1.provideData("Filtered activites available", activities)
        const response1 = await agent1.call()

        const agent2 = new Agent("Organize the activities by day, including meal breaks and accommodations. Ensure the schedule accounts for timings, distances, overall feasibility, and that the total cost does not exceed the provided budget.", [["id", "number (id of the activity)"], ["startingTime", "Date (ISO 8601 format)"], ["endingTime", "Date (ISO 8601 format)"]])
        agent2.provideData("Activities grouped by geographical areas", response1)
        agent2.provideData("Start of stay", startDate)
        agent2.provideData("End of stay", endDate)
        agent2.provideData("Budget", `${budget} ${currency}` as unknown as object)
        const response2 = await agent2.call()

        const locations = await pb.collection('activities').getFullList({
            filter: response2.map(k => `id = '${k.id}'`).join('||')
        });

        const itinerary = response2.map(it => {
            const location = locations.find(loc => loc.id === it.id);
            location.picture = `${process.env.DATABASE}/api/files/activities/${location.id}/${location.picture}`
            return {
                ...it,
                ...location
            };
        });

        return { itinerary };
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
