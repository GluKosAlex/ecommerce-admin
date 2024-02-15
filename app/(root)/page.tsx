'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useSession } from 'next-auth/react';

export default function RootPage() {
  const { isOpen, onOpen } = useStoreModal();

  const session = useSession();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <main>
      <div className='p-4'>RootPage</div>
    </main>
  );
}
