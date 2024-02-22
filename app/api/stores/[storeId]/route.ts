import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';
import prismadb from '@/lib/prismadb';

export async function PATCH(request: Request, { params }: { params: { storeId: string } }) {
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();

    const { userId } = session;
    const { storeId } = params;
    const { name } = body;

    if (!name) return new NextResponse('Name is required', { status: 400 });

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_PATCH]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function DELETE(_request: Request, { params }: { params: { storeId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });

    const { userId } = session;
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_DELETE]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
