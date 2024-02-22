import { auth } from '@/configs/auth';
import { redirect } from 'next/navigation';

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
