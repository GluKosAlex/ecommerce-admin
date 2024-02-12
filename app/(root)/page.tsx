import { UserButton } from '@clerk/nextjs';

export default function RootPage() {
  return (
    <main>
      <div className='p-4'>
        <UserButton afterSignOutUrl='/'/>
      </div>
    </main>
  );
}
