import prismadb from '@/lib/prismadb';

const DashboardPage = async (params: { storeId: string }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  console.log(store?.id);

  return <div>Active storew: {store?.id}</div>;
};

export default DashboardPage;
