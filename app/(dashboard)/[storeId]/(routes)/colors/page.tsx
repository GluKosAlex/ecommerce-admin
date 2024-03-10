import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import prismadb from '@/lib/prismadb';
import { ColorsClient } from './components/client';
import { ColorColumn } from './components/columns';

export const dynamic = 'force-dynamic';

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    }, // sort by createAt in descending order
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'do MMMM, yyyy', { locale: ru }),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
