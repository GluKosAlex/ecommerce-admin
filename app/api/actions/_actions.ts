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

export const deleteBillboardImage = async (imagePath: string) => {
  try {
    await stat(imagePath); // Check if the image exists
    await unlink(imagePath); // Delete the image
  } catch (_error) {
    // Ignore if the image doesn't exist
  }
};

export const getBillboardImage = async (imagePath: string) => {
  try {
    await stat(imagePath); // Check if the image exists
    const formData = {
      name: 'image',
      image: {
        value: createReadStream(imagePath),
        options: {
          filename: path.basename(imagePath),
          contentType: `image/${path.extname(imagePath).split('.')[1]}`,
        },
      },
    };
    return formData;
  } catch (_error) {
    // Ignore if the image doesn't exist
  }
};
