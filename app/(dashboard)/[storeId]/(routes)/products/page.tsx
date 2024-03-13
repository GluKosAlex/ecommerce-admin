import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import { formatter } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    }, // include the category, size, and color associated with the product
    orderBy: {
      createdAt: 'desc',
    }, // sort by createAt in descending order
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()), // format the price as a currency string
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'do MMMM, yyyy', { locale: ru }),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
