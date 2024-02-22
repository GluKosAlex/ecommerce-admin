import { getUserIdFromSession } from '@/utils/get-session-data';
import prismadb from '@/lib/prismadb';
import UserButton from '@/components/user-button';
import MainNav from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';

export default async function Navbar({}) {
  const userId = await getUserIdFromSession();

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <div className=''>
          <StoreSwitcher items={stores} />
        </div>
        <MainNav className='mx-6' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
