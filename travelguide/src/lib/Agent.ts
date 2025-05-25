import Cerebras from '@cerebras/cerebras_cloud_sdk';
import type { ChatCompletionCreateParams } from '@cerebras/cerebras_cloud_sdk/resources/index.mjs';

const apiKey = process.env.CEREBRAS_API_KEY

const client = new Cerebras({ apiKey });

type Message = ChatCompletionCreateParams.SystemMessageRequest
    | ChatCompletionCreateParams.UserMessageRequest
    | ChatCompletionCreateParams.AssistantMessageRequest
    | ChatCompletionCreateParams.ToolMessageRequest

export class Agent {
    protected context: Message
    protected datas: Message[] = [];
    protected outputFormat: Message

    constructor(roleContext: string, requirements: [string, string][]) {
        this.context = {
            role: 'system',
            content: roleContext,
        }

        const format: string = requirements.map(el => `- ${el.join(" : ")}`).join("\n")
        const outputMSG: Message = {
            role: 'system',
            content: `The output structure must stricly follow :\n${format}\nRespond ONLY with a valid JSON array.Do not include any explanation or extra text.`,
        }
        this.outputFormat = outputMSG
    }

    public provideData(title: string, data: object) {
        this.datas.push({
            role: 'system',
            content: `${title}: ${JSON.stringify(data)}`,
        });
    }

    async call() {
        const messages = [this.context, ...this.datas, this.outputFormat]

        const completionCreateResponse = await client.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b',
        });
        return JSON.parse(completionCreateResponse.choices.at(-1)?.message.content);
    }
}