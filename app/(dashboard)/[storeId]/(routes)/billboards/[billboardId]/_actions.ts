'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export const uploadBillboardImage = async (data: FormData) => {
  const image = data.get('image') as File;
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = join(process.cwd(), 'public', image.name);
  await writeFile(path, buffer);

  const imageUrl = `http://localhost:3000/${image.name}`;
  return imageUrl;
};
