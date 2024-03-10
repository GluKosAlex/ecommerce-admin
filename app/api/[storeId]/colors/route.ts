import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await auth();
    const { name, value } = await request.json();

    if (!session || !session.userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Value is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId: session.userId,
        id: params.storeId,
      },
    }); // Check if user has permission to access this store

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    } // Check if user has permission to access this store

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    }); // Create new color

    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_POST]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function GET(_req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    }); // get all colors for this store

    return NextResponse.json(colors);
  } catch (error) {
    console.error('[COLORS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
