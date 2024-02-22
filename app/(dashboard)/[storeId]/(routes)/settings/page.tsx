import prismadb from '@/lib/prismadb';
import { getUserIdFromSession } from '@/utils/get-session-data';

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const userId = await getUserIdFromSession();

  const store = prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  return <div>SettingsPage</div>;
};

export default SettingsPage;
