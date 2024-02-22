import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import { auth } from '@/configs/auth';
/**
 * Find a store by user ID and ID.
 *
 * @param {string} id - The ID of the store
 * @param {string} userId - The ID of the user
 * @return {Promise<Store>} The store found by user ID and ID
 */
export const findStoreByUserIdAndId = async (id: string, userId: string) => {
  const store = await prismadb.store.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return store;
};

/**
 * Retrieves the user ID from the session after authenticating.
 *
 * @return {string} The user ID retrieved from the session.
 */
export const getUserIdFromSession = async () => {
  const session = await auth();

  if (!session || !session.userId) {
    redirect('/sign-in');
  }

  const { userId } = session;

  return userId;
};
