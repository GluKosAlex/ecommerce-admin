import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';
import { deleteBillboardImage } from './../../../actions/_actions';

export async function GET(_request: Request, { params }: { params: { billboardId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const { billboardId } = params;

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    }); // Get the billboard by ID

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
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

    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const currentImageUrl = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
      select: {
        imageUrl: true,
      },
    }); // Get the current image URL for the billboard

    if (currentImageUrl?.imageUrl) {
      await deleteBillboardImage(currentImageUrl.imageUrl);
    } // Delete the current image file if it exists

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    }); // Update the billboard

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });

    const { userId } = session;
    const { storeId, billboardId } = params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const currentImageUrl = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
      select: {
        imageUrl: true,
      },
    }); // Get the current image URL for the billboard
    console.log('🚀 ~ currentImageUrl:', currentImageUrl);

    if (currentImageUrl?.imageUrl) {
      await deleteBillboardImage(currentImageUrl.imageUrl);
    } // Delete the current image file if it exists

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    }); // Delete the billboard

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
