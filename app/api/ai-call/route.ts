import { OpenAI } from 'langchain/llms/openai';
import path from 'path';
import * as fs from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createClient } from 'redis';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RedisVectorStore } from 'langchain/vectorstores/redis';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import {
  arrayUnion,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { PromptTemplate } from 'langchain/prompts';

const client = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});
client.connect();

export async function POST(req: Request, response: Response) {
  try {
    console.log('ghellod');
    const llm = new OpenAI({
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });

    console.log('llm,', llm);

    const template =
      'You are Ann. You help young woman to understand personal finances. You like to use emojis. You tend to make some jokes. Always speak directly to the person who asked. This a question you got from a young women: {question}';
    const promptA = new PromptTemplate({
      template,
      inputVariables: ['question'],
    });

    const jsonDirectory = path.join(process.cwd(), 'data');
    const text = fs.readFileSync(jsonDirectory + '/test.txt', 'utf8');

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    console.log('textSpliiter', textSplitter);

    const body = await req.json();

    const q = await promptA.format({ question: body.question });

    const docs = await textSplitter.createDocuments([text]);

    console.log('docs', docs);

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

    const chatRefs = collection(db, 'chats');

    const current: any = query(chatRefs, where('id', '==', body.id));

    const snapshot = await getDocs(current);

    const doc = snapshot.docs[0];

    /* Ask it a question */
    const question = body.question;

    const res = await chain.call({
      question,
      chat_history: (doc.data() as any).chatHistory,
    });

    console.log(res.data);

    if (res) {
      await updateDoc(doc.ref, {
        chatHistory: arrayUnion({ message: res.text, user: 'bot' }),
      });
    }
    response.ok;
  } catch (error) {
    console.log(error);
  }
}
