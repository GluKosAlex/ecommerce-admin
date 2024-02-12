'use client';

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modal';

export default function RootPage() {
  const { isOpen, onOpen } = useStoreModal();

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
