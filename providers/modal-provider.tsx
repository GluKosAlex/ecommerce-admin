'use client';

import { useEffect, useState } from 'react';

import { StoreModal } from '@/components/modals/store-modal';

const ModalProvider = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // To prevent Next.js Hydration errors https://nextjs.org/docs/messages/react-hydration-error
  }, []);

  return !isClient ? null : <StoreModal />;
};

export default ModalProvider;
