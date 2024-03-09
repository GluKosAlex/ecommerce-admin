import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import prismadb from '@/lib/prismadb';
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

export const dynamic = 'force-dynamic';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    }, // sort by createAt in descending order
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'do MMMM, yyyy', { locale: ru }),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
