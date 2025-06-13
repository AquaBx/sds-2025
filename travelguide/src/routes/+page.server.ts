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

        const interests = formData.getAll("tags") || []
        const budget = formData.get("budget")!;
        const currency = formData.get("currency")!;
        const startDate = formData.get("startDate")!;
        const endDate = formData.get("endDate")!;
        const disability = formData.get("disability") == "on";
        const city = formData.get("city")!

        const activities = await pb.collection('activities').getFullList({
            filter: `(${interests.map(tag => `tags?~'${tag}'`).join('||')})&&(city='${city}')${disability ? "" : "&&(disableAccessibility=True)"}`,
        });

        const restaurant_hotels = await pb.collection('activities').getFullList({
            filter: `type.text = "Restaurant" || type.text = "Hotel"`,
        });

        function getDaysArray(start: string, end: string): Date[] {
            const arr: Date[] = [];
            let dt = new Date(start);
            while (dt <= new Date(end)) {
                arr.push(new Date(dt));
                dt.setDate(dt.getDate() + 1);
            }
            return arr;
        }

        let remainingActivities: any[] = [...activities];
        let itinerary: any[] = [];
        const days = getDaysArray(startDate as string, endDate as string);

        for (const day of days) {
            if (remainingActivities.length === 0) break;
            const agent2 = new Agent("Organize the activities by day, ensuring there is at least one activity in the morning and one in the evening. Include meals and accommodations. Ensure the schedule accounts for timings, distances, overall feasibility, and that the total cost does not exceed the provided budget. Additionally, select appropriate restaurants and hotels for the day.", [["id", "number (id of the activity)"], ["startingTime", "Date (ISO 8601 format)"], ["endingTime", "Date (ISO 8601 format)"]])
            agent2.provideData("Meals and accommodations", restaurant_hotels)
            agent2.provideData("Activities", remainingActivities)
            agent2.provideData("Date of the day", { date: day.toISOString().split('T')[0] })
            agent2.provideData("Budget", `${budget} ${currency}` as unknown as object)
            const responseDay: any[] = await agent2.call();

            const locations = await pb.collection('activities').getFullList({
                filter: responseDay.map((k: any) => `id = '${k.id}'`).join('||')
            });

            let coordinates = locations.map(c => [c.location.lat, c.location.lon])

            let route = null;
            if (coordinates.length > 1) {
                try {
                    const orsRes = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                            'Authorization': process.env.ORS_API_KEY as string
                        },
                        body: JSON.stringify({ coordinates })
                    });
                    if (orsRes.ok) {
                        route = await orsRes.json();
                    } else {
                        throw "null"
                    }
                } catch (e) {
                    console.log("erreur")
                    console.log(coordinates)
                    console.log(fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                            'Authorization': process.env.ORS_API_KEY as string
                        },
                        body: JSON.stringify({ coordinates })
                    }))
                    throw e
                }
            }

            const selectedIds = responseDay.map((a: any) => a.id);
            remainingActivities = remainingActivities.filter((a: any) => !selectedIds.includes(a.id));

            const dayitinerary = responseDay.map((it: any) => {
                const location = locations.find((loc: any) => loc.id === it.id);
                if (location) {
                    location.picture = `${process.env.DATABASE}/api/files/activities/${location.id}/${location.picture}`
                    return {
                        ...it,
                        ...location,
                    };
                }
                return it;
            });
            itinerary.push({ itinerary: dayitinerary, route })
        }

        return { itinerary };
    },

    search: async (event) => {

        const formData = await event.request.formData();
        const interests = formData.getAll("tags") || []
        const search = String(formData.get("search") || "");
        const hourRange = String(formData.get("hourRange") || "00,24").split(",").map((h: string) => h.length === 1 ? `0${h}` : h);
        const maxPrice = formData.get("maxPrice") || 1000

        const activities = await pb.collection('activities').getFullList({
            filter: `(${interests.map(tag => `tags?~'${tag}'`).join('||')})&&(description~'${search}'||name~'${search}')&&(price<${maxPrice})&&(openingTime<=${hourRange[0]})&&(closingTime>=${hourRange[1]})`
        });

        for (const p of activities) {
            p.picture = `${process.env.DATABASE}/api/files/activities/${p.id}/${p.picture}`
        }

        return {
            activities
        }
    },
}
