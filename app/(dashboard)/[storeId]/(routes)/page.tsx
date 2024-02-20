import prismadb from '@/lib/prismadb';

const DashboardPage = async (params: { storeId: string }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>Active store: {store?.name}</div>;
};

export default DashboardPage;
