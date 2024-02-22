import Navbar from '@/components/navbar';
import { findStoreByUserIdAndId, getUserIdFromSession } from '@/utils/data-access-utils';

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const userId = await getUserIdFromSession();

  const store = await findStoreByUserIdAndId(params.storeId, userId);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
