'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function RootPage() {
  const { isOpen, onOpen } = useStoreModal();

  const session = useSession();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <main className='flex flex-col items-center'>
      <nav className='flex gap-4 p-4'>
        <Link className={buttonVariants({ variant: 'outline' })} href='/sign-up'></Link>
        <Link className={buttonVariants({ variant: 'outline' })} href='/sign-in'></Link>
      </nav>
    </main>
  );
}
