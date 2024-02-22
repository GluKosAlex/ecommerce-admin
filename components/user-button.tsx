'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function UserButton() {
  const { data } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) setIsLoading(false);
  }, [data]);

  //TODO: ADD a modal with user control panel

  return (
    <Button variant={'outline'}>
      {isLoading ? <Icons.spinner className='h-4 w-4 animate-spin' /> : data?.user?.email}
    </Button>
  );
}
