import prismadb from '@/lib/prismadb';
import { BillboardClient } from './components/client';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createAt: 'desc',
    }, // sort by createAt in descending order
  });
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient billboards={billboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
