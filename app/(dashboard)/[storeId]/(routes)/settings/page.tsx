import { findStoreByUserIdAndId, getUserIdFromSession } from '@/utils/data-access-utils';

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const userId = await getUserIdFromSession();

  const store = await findStoreByUserIdAndId(params.storeId, userId);

  return <div>SettingsPage</div>;
};

export default SettingsPage;
