import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { USER_PROMPT, SYSTEM_PROMPT } from '@/app/constants/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { url, img } = await req.json()
  const imageUrl = url ?? img

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // বা gpt-4.1
    stream: true,
    max_tokens: 2048,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: USER_PROMPT },
          {
            type: 'image_url',
            image_url: { url: imageUrl }, // ✅ অবজেক্ট আকারে দিতে হবে
          },
        ],
      },
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
