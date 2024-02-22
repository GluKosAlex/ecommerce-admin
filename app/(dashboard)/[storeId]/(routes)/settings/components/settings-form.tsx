'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { AlertModal } from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type SettingsFormData = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const origin = useOrigin();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: initialData.name },
  });

  const { toast } = useToast();

  const onSubmit = async (data: SettingsFormData) => {
    try {
      if (data.name === initialData.name) {
        toast({
          variant: 'destructive',
          title: 'The name has to be different from the current name',
        });
        return;
      }
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh(); // Refresh the page to reflect the changes in the database
      toast({
        variant: 'default',
        title: 'Store updated',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: (
          <ToastAction onClick={async () => await onSubmit(data)} altText='Try again'>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast({
        variant: 'default',
        title: 'Store deleted',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Make sure you removed all products and categories first.',
      });
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isLoading} />
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
      <Separator />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${params.storeId}`}
        variant='public'
      />
    </>
  );
};
