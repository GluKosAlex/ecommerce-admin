'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type SettingsFormData = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: initialData.name },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    console.log(data);
    setIsLoading(false);
  };
  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage your store settings.' />
        <Button variant='destructive' size='icon' onClick={() => setOpen(true)} disabled={isLoading}>
          <Trash2 className='size-4' />
        </Button>
      </div>
      <Separator className='my-2' />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <fieldset className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Store name' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Button type='submit' disabled={isLoading} className='min-w-[150px] ml-auto'>
            {isLoading ? <Icons.spinner className='h-4 w-4 animate-spin' /> : 'Save changes'}
          </Button>
        </form>
      </Form>
    </>
  );
};
