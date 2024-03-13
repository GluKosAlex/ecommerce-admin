'use server';

import { createReadStream } from 'fs';
import { writeFile, stat, mkdir, access, unlink, readFile } from 'fs/promises';
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

  const folderPath = join(process.cwd(), 'public', `user_id_${userId}`, 'images', storeId, 'billboards'); // Path to the folder where the image will be stored

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

  const localPath = join(
    process.cwd(),
    'public',
    `user_id_${userId}`,
    'images',
    storeId,
    'billboards',
    fileName
  ); // Path to the folder where the image is stored

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

  const images = data.get('images') as unknown as File[]; // Get the images from the form
  console.log('🚀 ~ uploadProductImages ~ images:', images);

  if (!images) {
    throw new Error('at least one images is required');
  }

  if (images.some((image) => image.size > 5 * 1024 * 1024)) {
    throw new Error('Some of the images is too large');
  }

  if (images.some((image) => image.type !== 'image/jpeg' && image.type !== 'image/png')) {
    throw new Error('All of the images must be JPEG or PNG');
  }

  const folderPath = join(process.cwd(), 'public', `user_id_${userId}`, 'images', storeId, 'billboards'); // Path to the folder where the image will be stored

  try {
    await access(folderPath); // Check if the folder exists
  } catch (_error) {
    await mkdir(folderPath, { recursive: true }); // Create the folder if it doesn't exist
  }
  const imagesUrls = await Promise.all(
    images.map(async (image) => {
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
    })
  );

  return imagesUrls;
};
