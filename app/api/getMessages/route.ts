import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { NextResponse } from 'next/server';

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

// get chat history
export async function POST(req: Request, response: Response) {
  const body = await req.json();

  const chatRefs = collection(db, 'chats');

  const q: any = query(chatRefs, where('id', '==', body));

  const snapshot = await getDocs(q);

  console.log(snapshot.empty);

  if (snapshot.empty) {
    const docRef = await addDoc(chatRefs, {
      chatHistory,
      id: body,
    });

    const data = await getDoc(docRef);

    return NextResponse.json((data.data() as any).chatHistory);
  } else {
    return NextResponse.json((snapshot.docs[0].data() as any).chatHistory);
  }
}
