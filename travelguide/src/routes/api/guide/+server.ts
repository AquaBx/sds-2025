import prisma from '$lib/prisma';
import { Mistral } from '@mistralai/mistralai';
import type { SystemMessage, ToolMessage, UserMessage, AssistantMessage } from '@mistralai/mistralai/models/components';
import { json, type RequestHandler } from '@sveltejs/kit';

const apiKey = process.env.MISTRAL_API_KEY;
const model = "ministral-3b-latest";
// const model = "mistral-small-latest";

const client = new Mistral({ apiKey: apiKey });


type Messages = ((SystemMessage & {
  role: "system";
}) | (UserMessage & {
  role: "user";
}) | (AssistantMessage & {
  role: "assistant";
}) | (ToolMessage & {
  role: "tool";
}))[]

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

const namesToFunctions: { [k: string]: (arg0: any) => any } = {
  'findActivitiesInCity': async ({ cityId, interests }: { cityId: number, interests: string[] }) => {
    let req = await prisma.activity.findMany({
      where: {
        cityId: { equals: cityId },
        tags: {
          some: {
            name: {
              in: interests
            }
          }
        }
      }
    })
    return req
  },
};

export const POST: RequestHandler = async ({ request }) => {
  const { cityId, city, interests, budget, currency, startDate, endDate, disability } = await request.json();

  const messages: Messages = [
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
            ${disability ? "avoids places that are not accessible for people with reduced mobility" : ""}
            
            You shall ask the database with the function to gets the activities available.

            Each activity must strictly follow this structure:
            - id: number (database id of the activity)
            - name : string (name of the activity)
            - startingTime: Date (ISO 8601 format)
            - endingTime: Date (ISO 8601 format)

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

  const msg = (response.choices!)[0].message as (AssistantMessage & { role: "assistant"; })
  messages.push(msg);
  const toolCall = msg.toolCalls![0];

  const functionName = toolCall.function.name;
  const functionParams = JSON.parse(toolCall.function.arguments);
  const funcall =  await namesToFunctions[functionName](functionParams)
  messages.push({
    role: "tool",
    name: functionName,
    toolCallId: toolCall.id,
    content: JSON.stringify(funcall),
  } as ToolMessage & { role: "tool" })


  await new Promise(resolve => setTimeout(resolve, 1500));

  response = await client.chat.complete({
    model: model,
    messages: messages,
  });

  let content = (response.choices)![0].message.content!;
  content = (content as string).replace('```json', '').replace('```', '');
  const itinerary = JSON.parse(content)
  const keys = itinerary.map(e => e.id)
  console.log(funcall,itinerary, keys)

  const locations = await prisma.activity.findMany({
    where: {
      id: { in: keys }
    },
    include: {
      picture: true,
    },
  })

  const merged = itinerary.map(it => {
    const location = locations.find(loc => loc.id === it.id);
    return {
      ...it,
      ...location
    };
  });

  return json({ itinerary: merged });
}