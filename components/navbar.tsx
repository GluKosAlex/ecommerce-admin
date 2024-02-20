import UserButton from '@/components/user-button';
import MainNav from '@/components/main-nav';

export default function Navbar() {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <div className=''>Store switcher</div>
        <MainNav className='' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
