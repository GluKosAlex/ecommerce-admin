'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function RootPage() {
  const { isOpen, onOpen } = useStoreModal();

  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <main className='flex flex-col'>
      <nav className='flex justify-between p-4'>
        <div className='flex gap-4'>
          <Link className={buttonVariants({ variant: 'outline' })} href='/sign-up'>
            Sing Up
          </Link>
          <Link className={buttonVariants({ variant: 'outline' })} href='/sign-in'>
            Sing In
          </Link>
        </div>
        <p className='flex items-center'>{session?.user?.email}</p>
      </nav>
    </main>
  );
}
