import prisma from '$lib/prisma';
import { Mistral } from '@mistralai/mistralai';
import type { Messages, SystemMessage, ToolMessage, UserMessage } from '@mistralai/mistralai/models/components';
import { json, type RequestHandler } from '@sveltejs/kit';

const apiKey = process.env.MISTRAL_API;
const model = "ministral-3b-latest";
// const model = "mistral-small-latest";

const client = new Mistral({ apiKey: apiKey });



const tools = [
    {
        type: "function",
        function: {
            name: "findActivitiesInCity",
            description: "Get a list of activities in a given city based on the parameters",
            parameters: {
                type: "object",
                properties: {
                    cityId: {
                        type: "number",
                        description: "the id of the city in the database",
                    },
                    interests: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "list of interests"
                    }
                },
                required: ["cityId"],
            },
        },
    },
]

const namesToFunctions = {
    'findActivitiesInCity': async (parameters) => {
        return await prisma.activity.findMany({
            where: {
                cityId: { equals: parameters.cityId },
                tags: {
                    some: {
                        name: {
                            in: parameters.interests
                        }
                    }
                }
            }
        })
    },
};

export const POST: RequestHandler = async ({ request }) => {
    const { city, cityId, startDate, endDate, budget, currency, interests } = await request.json();

    let messages: Messages = [
        {
            role: 'system',
            content:
                'You are an assistant that generates realistic JSON data for a travel itinerary planner. Each item should be a detailed activity or place to visit during a trip, formatted strictly according to the required schema.'
        },
        {
            role: 'user',
            content: `
            Generate a JSON array for a travel itinerary in ${city} which is identified as id ${cityId}, from ${startDate} to ${endDate}.
            The activities should match these user preferences: interested in ${interests.join(", ")};
            the budget is ${budget} ${currency};
            avoids places that are not accessible for people with reduced mobility.
            
            Each activity must strictly follow this structure:
            - id: number (id of the activity)
            - startingTime: Date (ISO 8601 format)
            - endingTime: Date (ISO 8601 format)

            You shall ask the database with the function to gets the activities available.

            Respond ONLY with a valid JSON array. Do not include any explanation or extra text.
        `
        }
    ]

    let response = await client.chat.complete({
        model: model,
        messages: messages,
        tools: tools,
        tool_choice: "any",
        parallelToolCalls: false,
    });

    messages.push(response.choices[0].message);
    const toolCall = response.choices[0].message.toolCalls[0];

    const functionName = toolCall.function.name;
    const functionParams = JSON.parse(toolCall.function.arguments);

    messages.push({
        role: "tool",
        name: functionName,
        toolCallId: toolCall.id,
        content: JSON.stringify(namesToFunctions[functionName](functionParams))
    } as ToolMessage & { role: "tool" })


    await new Promise(resolve => setTimeout(resolve, 1500));

    response = await client.chat.complete({
        model: model,
        messages: messages,
    });

    let content = response.choices[0].message.content;
    content = content.replace('```json', '').replace('```', '');
    let itinerary = JSON.parse(content)
    let keys = itinerary.map(e => e.id)

    let locations = await prisma.activity.findMany({
        where: {
            id: { in: keys }
        }
    })

    return json({ itinerary:itinerary, locations });
}