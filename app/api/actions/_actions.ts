'use server';

import { writeFile, stat, mkdir, access, unlink } from 'fs/promises';
import path, { join } from 'path';

import { getUserIdFromSession } from '@/utils/data-access-utils';

export const uploadBillboardImage = async (data: FormData, storeId: string) => {
  const userId = await getUserIdFromSession(); // Get the user ID from the session

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const image = data.get('image') as File; // Get the image from the form

  if (!image) {
    throw new Error('Image is required');
  }

  if (image.size > 5 * 1024 * 1024) {
    throw new Error('Image is too large');
  }

  if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
    throw new Error('Image must be a JPEG or PNG');
  }

  // Path to the folder where the image will be stored
  const folderPath = join(process.cwd(), 'public', `user_id_${userId}`, 'images', storeId, 'billboards');

  try {
    await access(folderPath); // Check if the folder exists
  } catch (_error) {
    await mkdir(folderPath, { recursive: true }); // Create the folder if it doesn't exist
  }

  const bytes = await image.arrayBuffer(); // Convert the image to bytes
  const buffer = Buffer.from(bytes); // Convert the bytes to a buffer
  const path = join(
    `user_id_${userId}`,
    'images',
    storeId,
    'billboards',
    `billboard_background_image_${Date.now()}.${image.type.split('/')[1]}`
  ); // Path to the file where the image will be stored

  await writeFile(join(process.cwd(), 'public', path), buffer); // Write the image to the file

  const imageUrl = new URL(path, 'http://localhost:3000').href; // Get the URL of the image

  return imageUrl;
};

export const deleteBillboardImage = async (imageUrl: string, storeId: string) => {
  const userId = await getUserIdFromSession(); // Get the user ID from the session

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const fileName = path.basename(imageUrl); // Get the name of the image

  // Path to the folder where the image is stored
  const localPath = join(
    process.cwd(),
    'public',
    `user_id_${userId}`,
    'images',
    storeId,
    'billboards',
    fileName
  );

  try {
    await stat(localPath); // Check if the image exists
    await unlink(localPath); // Delete the image
  } catch (_error) {
    // Ignore if the image doesn't exist
  }
};

export const uploadProductImages = async (data: FormData, storeId: string) => {
  const userId = await getUserIdFromSession(); // Get the user ID from the session

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const images = data.getAll('images') as File[]; // Get the images from the form

  if (!images) {
    throw new Error('at least one images is required');
  }

  if (images.some((image) => image.size > 5 * 1024 * 1024)) {
    throw new Error('Some of the images is too large');
  }

  if (images.some((image) => image.type !== 'image/jpeg' && image.type !== 'image/png')) {
    throw new Error('All of the images must be JPEG or PNG');
  }

  // Path to the folder where the image will be stored
  const folderPath = join(process.cwd(), 'public', `user_id_${userId}`, 'images', storeId, 'products');

  try {
    await access(folderPath); // Check if the folder exists
  } catch (_error) {
    await mkdir(folderPath, { recursive: true }); // Create the folder if it doesn't exist
  }

  const imagesUrls: string[] = [];

  for (const image of images) {
    const bytes = await image.arrayBuffer(); // Convert the image to bytes
    const buffer = Buffer.from(bytes); // Convert the bytes to a buffer
    const path = join(
      `user_id_${userId}`,
      'images',
      storeId,
      'products',
      `product_image_${Date.now()}.${image.type.split('/')[1]}`
    ); // Path to the file where the image will be stored

    await writeFile(join(process.cwd(), 'public', path), buffer); // Write the image to the file

    imagesUrls.push(new URL(path, 'http://localhost:3000').href); // Get the URL of the image
  }

  return imagesUrls;
};

export const deleteProductImages = async (imageUrls: string[], storeId: string) => {
  const userId = await getUserIdFromSession(); // Get the user ID from the session

  if (!userId) {
    throw new Error('Unauthorized');
  }

  imageUrls.forEach(async (imageUrl) => {
    const fileName = path.basename(imageUrl); // Get the name of the image

    // Path to the folder where the image is stored
    const localPath = join(
      process.cwd(),
      'public',
      `user_id_${userId}`,
      'images',
      storeId,
      'products',
      fileName
    );

    try {
      await stat(localPath); // Check if the image exists
      await unlink(localPath); // Delete the image
    } catch (error) {
      // Ignore if the image doesn't exist
    }
  });
};
