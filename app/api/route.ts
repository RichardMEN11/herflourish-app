import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { RedisVectorStore } from 'langchain/vectorstores/redis';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import path from 'path';
import { createClient } from 'redis';
import { PromptTemplate } from 'langchain/prompts';

// Dummy data
const chatHistory = [
  {
    user: 'bot',
    message:
      'Hi 👋, I am Ann, your financial friend powered by AI. I am here to help answer any questions you have about personal finance, investments, budgeting, or anything else related to your financial well-being. Feel free to ask me anything, and I will do my best to provide you with helpful and informative answers.',
  },
  {
    user: 'bot',
    message: 'How can I help you today? 🤗',
  },
];

const client = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});
client.connect();

// get chat history
export async function GET() {
  return NextResponse.json(chatHistory);
}

// update chat history
export async function POST(req: Request, response: Response) {
  const body = await req.json();

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const jsonDirectory = path.join(process.cwd(), 'data');
  const text = fs.readFileSync(jsonDirectory + '/test.txt', 'utf8');

  const template =
    'You are Ann. You help young woman to understand personal finances. You like to use emojis. This a question you got from a young women: {question}';
  const promptA = new PromptTemplate({
    template,
    inputVariables: ['question'],
  });

  const q = await promptA.format({ question: body });

  console.log(q);

  if (body) {
    chatHistory.push({
      user: 'user',
      message: body,
    });
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  const vectorStore = await RedisVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      redisClient: client,
      indexName: 'docs',
    }
  );
  /* Create the chain */
  const chain = ConversationalRetrievalQAChain.fromLLM(
    llm,
    vectorStore.asRetriever(),
    {
      questionGeneratorTemplate: q,
    }
  );
  /* Ask it a question */
  const question = body;
  const res = await chain.call({ question, chat_history: chatHistory });

  if (res) {
    chatHistory.push({
      user: 'bot',
      message: res.text,
    });
  }

  response.ok;
}
