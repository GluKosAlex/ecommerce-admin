import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';

export async function GET(_request: Request, { params }: { params: { sizeId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const { sizeId } = params;

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    }); // Get the size by ID

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZES_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function PATCH(request: Request, { params }: { params: { storeId: string; sizeId: string } }) {
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

    if (!params.sizeId) {
      return new NextResponse('Size ID is required', { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    }); // Update the size

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function DELETE(_request: Request, { params }: { params: { storeId: string; sizeId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });

    const { userId } = session;
    const { storeId, sizeId } = params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    }); // Delete the size

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
