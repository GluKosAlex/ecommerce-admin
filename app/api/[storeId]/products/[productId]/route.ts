import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';
import { deleteProductImages } from '../../../actions/_actions';
// import { IProductDataRequest } from '@/types/types';

export async function GET(_request: Request, { params }: { params: { productId: string } }) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const { productId } = params;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    }); // Get the product by ID

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const data: IProductDataRequest = await request.json();
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = data;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || images.length === 0) {
      return new NextResponse('At least one image is required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse('product ID is required', { status: 400 });
    }

    // Check if user has permission to access this store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId: session.userId,
        id: params.storeId,
      },
    });

    // Send error if user does not have permission
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update the product
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    // Create new image URLs
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  //_request is not used but is required because the 'params' must be passed to the function as second argument. '_' is used to indicate that the parameter is not used, it is just a placeholder
  try {
    const session = await auth();

    if (!session?.userId) return new NextResponse('Unauthorized', { status: 401 });

    const { userId } = session;
    const { storeId, productId } = params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    // Check if user has permission to access this store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId: session.userId,
        id: params.storeId,
      },
    });

    // Send error if user does not have permission
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get the current images URLs for the product
    const currentImageUrls = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      select: {
        images: true,
      },
    });

    // Delete the current image files from the server
    if (currentImageUrls && currentImageUrls.images) {
      await deleteProductImages(
        currentImageUrls.images.map((image) => image.url),
        storeId
      );
    }

    // Delete the product from the database
    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[productS_DELETE]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
