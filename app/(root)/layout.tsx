import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';
import { getUserIdFromSession } from '@/utils/get-session-data';

const SetupLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const userId = await getUserIdFromSession();

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
