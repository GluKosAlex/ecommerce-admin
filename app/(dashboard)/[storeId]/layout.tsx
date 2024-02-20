import { auth } from '@/configs/auth';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';

const DashboardLayout = async ({
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
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <div className=''>This will be a Navbar</div>
      {children}
    </>
  );
};

export default DashboardLayout;
