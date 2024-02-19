import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();

    return NextResponse.json({ userId: session?.userId }, { status: 200 });
  } catch (error) {
    console.error('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
