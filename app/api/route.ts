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
import {
  arrayUnion,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';

// update chat history
export async function POST(req: Request, response: Response) {
  const body = await req.json();

  const chatRefs = collection(db, 'chats');

  const q: any = query(chatRefs, where('id', '==', body.id));

  const snapshot = await getDocs(q);

  const doc = snapshot.docs[0];

  await updateDoc(doc.ref, {
    chatHistory: arrayUnion({ message: body.message, user: 'user' }),
  });

  response.ok;

  //
  // console.log(q);
  // // if (body) {
  // //   chatHistory.push({
  // //     user: 'user',
  // //     message: body,
  // //   });
  // // }

  // /* Create the vectorstore */
  // const vectorStore = await RedisVectorStore.fromDocuments(
  //   docs,
  //   new OpenAIEmbeddings(),
  //   {
  //     redisClient: client,
  //     indexName: 'docs',
  //   }
  // );
  // /* Create the chain */
  // const chain = ConversationalRetrievalQAChain.fromLLM(
  //   llm,
  //   vectorStore.asRetriever(),
  //   {
  //     questionGeneratorTemplate: q,
  //   }
  // );
  // /* Ask it a question */
  // const question = body;
  // const res = await chain.call({ question, chat_history: chatHistory });
  // if (res) {
  //   chatHistory.push({
  //     user: 'bot',
  //     message: res.text,
  //   });
  // }
  // response.ok;
}
