import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import prismadb from '@/lib/prismadb';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    }, // sort by createAt in descending order
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => {
        return total + orderItem.product.price.toNumber(); // count the total price of all products
      }, 0)
    ), // format the total price as a currency string
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'do MMMM, yyyy', { locale: ru }),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
