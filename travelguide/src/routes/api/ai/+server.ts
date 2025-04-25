import prisma from '$lib/prisma';
import { Mistral } from '@mistralai/mistralai';
import { json, type RequestHandler } from '@sveltejs/kit';

const apiKey = "token";
const model = "ministral-3b-latest";
// const model = "mistral-small-latest";

const client = new Mistral({ apiKey: apiKey });

async function findMany(city:string) {
    const users = await prisma.activity.findMany()

}

const tools = [
    {
        type: "function",
        function: {
            name: "retrievePaymentStatus",
            description: "Get payment status of a transaction",
            parameters: {
                type: "object",
                properties: {
                    transactionId: {
                        type: "string",
                        description: "The transaction id.",
                    }
                },
                required: ["transactionId"],
            },
        },
    },
]

export const POST: RequestHandler = async ({ request }) => {
    const { destination, startDate, endDate, budget, currency } = await request.json();

    let messages = [
        {
            role: 'system',
            content:
                'You are an assistant that generates realistic JSON data for a travel itinerary planner. Each item should be a detailed activity or place to visit during a trip, formatted strictly according to the required schema.'
        },
        {
            role: 'user',
            content: `
            Generate a JSON array for a travel itinerary in ${destination}, from ${startDate} to ${endDate}.
            The activities should match these user preferences: interested in art, food, and history;
            the budget is ${budget} ${currency};
            avoids places that are not accessible for people with reduced mobility.
            
            Each activity must strictly follow this structure:
            - name: string (name of the activity)
            - coordinates: number[] (latitude, longitude)
            - type: string (e.g., 'museum', 'restaurant', 'tour')
            - tags: string[] (e.g., ['art', 'history'])
            - disableAccessibility: boolean (true if NOT accessible)
            - startingTime: Date (ISO 8601 format)
            - endingTime: Date (ISO 8601 format)
            - price: number (numeric cost of the activity)
            - currency: string (e.g., 'EUR')
            
            Respond ONLY with a valid JSON array. Do not include any explanation or extra text.
        `
        }
    ]

    let response = await client.chat.complete({
        model: model,
        messages: messages,
        tools: tools,
        parallelToolCalls: false,
    });

    let content = response.choices[0].message.content;
    content = content.replace('```json', '').replace('```', '');

    return json(JSON.parse(content));
}