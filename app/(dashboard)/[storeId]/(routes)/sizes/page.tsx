import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import prismadb from '@/lib/prismadb';
import { SizeClient } from './components/client';
import { SizeColumn } from './components/columns';

export const dynamic = 'force-dynamic';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    }, // sort by createAt in descending order
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'do MMMM, yyyy', { locale: ru }),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
