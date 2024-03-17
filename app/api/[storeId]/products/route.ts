import { NextResponse } from 'next/server';
import { auth } from '@/configs/auth';

import prismadb from '@/lib/prismadb';

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
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

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
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

    // Create new product
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)], // Convert the image URLs to image data
          },
        },
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url); // Get search parameters from the request
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? isFeatured === 'true' : undefined, // Check if isFeatured is set to 'true'
        isArchived: false, // Only get products that are not archived
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' }, // Sort products by createdAt in descending order
    }); // get all products for this store

    return NextResponse.json(products);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500, statusText: 'Internal Server Error' });
  }
}
