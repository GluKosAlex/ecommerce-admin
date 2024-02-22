'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onConfirm, onClose, loading }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // To prevent Next.js Hydration errors https://nextjs.org/docs/messages/react-hydration-error
  }, []);
  return !isClient ? null : (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex justify-end items-center w-full'>
        <Button variant='outline' onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant='destructive' onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};
