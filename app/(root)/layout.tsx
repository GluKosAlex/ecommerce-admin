import { auth } from '@/configs/auth';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';

const SetupLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const session = await auth();

  if (!session || !session.userId) {
    redirect('/sign-in');
  }

  const { userId } = session;

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};

export default SetupLayout;
