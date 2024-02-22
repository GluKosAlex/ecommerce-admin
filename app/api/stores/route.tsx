import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';
import { json } from 'stream/consumers';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name } = body;

    if (!session || !session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId: session.userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
