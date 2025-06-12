import type { RequestHandler } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

let user: any = null;

const pb = new PocketBase('https://pocketbase.oracle.aquabx.ovh');

export const POST: RequestHandler = async ({ request }) => {
    try {

        console.log('Rate API called');
        const { placeId, score, userId } = await request.json();
        const authHeader = request.headers.get('authorization');
        

        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');
        pb.authStore.save(token, null);
        console.log('Token reçu:', token);
        console.log('Utilisateur PocketBase après save:', pb.authStore.model);
        if (pb.authStore.isValid) {
            user = pb.authStore.model;
        }
        
        console.log(placeId, score, authHeader);
        console.log('UserId:', userId);
        /* if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }  */
        let existingVote = null;
        try {
            existingVote = await pb.collection('votes').getFirstListItem(
                `userId="${userId}" && placeId="${placeId}"`
            );
        } catch (e) {
        }

        if (existingVote) {
            return new Response(JSON.stringify({ error: 'Already voted' }), { status: 400 });
        }

        const data = {
            "score": score,
            "placeId": placeId,
            "userId": userId,
        };
        console.log('Creating vote:', data);

        const record = await pb.collection('votes').create(data);


        const votes = await pb.collection('votes').getFullList({
            filter: `placeId="${placeId}"`
        });
        const avg =
            votes.reduce((sum, v) => sum + (v.score ?? 0), 0) /
            (votes.length || 1);

        console.log('Average score:', avg);

        await pb.collection('activities').update(placeId, { score: avg });

        return new Response(JSON.stringify({ success: true, score: avg }));
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};