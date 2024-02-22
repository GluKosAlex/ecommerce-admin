'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Store } from '@prisma/client';
import { CheckIcon, ChevronsUpDown, PlusCircleIcon, Store as StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);

  const storeModal = useStoreModal(); // Modal state
  const params = useParams(); // Get current store ID
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  })); // Stores formatted for the dropdown

  const currentStore = formattedItems.find((item) => item.value === params.storeId); // Currently selected store

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false); // Close dropdown
    router.push(`/${store.value}`); // Navigate to store
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size='sm'
          role='combobox'
          aria-expanded={open}
          aria-label='Select store'
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.label || 'Select store'}
          <ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className='text-sm'>
                  <StoreIcon className='mr-2 h-4 w-4' />
                  {store.label}
                  {currentStore?.value === store.value && <CheckIcon className='ml-auto h-4 w-4' />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
                className='text-sm'
              >
                <PlusCircleIcon className='mr-2 size-4' />
                Add Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoreSwitcher;
