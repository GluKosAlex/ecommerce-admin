import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await auth();
    const { label, imageUrl } = await request.json();

    if (!session || !session.userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    }); // Create new billboard

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_POST]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function GET(_req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    }); // get all billboards for this store

    return NextResponse.json(billboards);
  } catch (error) {
    console.error('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
