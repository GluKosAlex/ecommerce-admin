import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';

export async function GET(_request: Request, { params }: { params: { colorId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const { colorId } = params;

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    }); // Get the color by ID

    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function PATCH(request: Request, { params }: { params: { storeId: string; colorId: string } }) {
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

    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    }); // Update the color

    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });

    const { userId } = session;
    const { storeId, colorId } = params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      },
    }); // Delete the color

    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
