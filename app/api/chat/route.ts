import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';

const prisma = new PrismaClient();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request) {
  const { message, userId } = await request.json();  

  // Save the message to the database
  const chatMessage = await prisma.chatMessage.create({
    data: { text: message, userId: userId },
  });

  // Generate AI response
  const aiResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  });

  // Save the AI response
  await prisma.chatMessage.create({
    data: { text: aiResponse.data.choices[0].message.content, userId: 'ai' },
  });

  // Retrieve full conversation history
  const conversationHistory = await prisma.chatMessage.findMany({
    orderBy: [{ createdAt: 'asc' }],
  });

  return NextResponse.json({ conversationHistory });
}