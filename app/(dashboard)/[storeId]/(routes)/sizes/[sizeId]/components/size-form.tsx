'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { AlertModal } from '@/components/modals/alert-modal';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
});

type SizeFormData = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const title = initialData ? 'Edit size' : 'Create size';
  const description = initialData ? 'Update your size.' : 'Create a new size.';
  const toastMessage = initialData ? 'Size updated' : 'Size created';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<SizeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  const {
    formState: { isDirty },
  } = form;

  const { toast } = useToast();

  const onSubmit = async (data: SizeFormData) => {
    try {
      if (!isDirty) {
        toast({
          variant: 'destructive',
          title: 'You need to change at least one field',
        });
        return;
      }

      setIsLoading(true);

      if (initialData) {
        // Update existing size if initialData is defined
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        // Create new size
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      router.push(`/${params.storeId}/sizes`); // Redirect to the size list
      router.refresh(); // Refresh the page to reflect the changes in the database

      toast({
        variant: 'default',
        title: toastMessage,
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

      router.push(`/${params.storeId}/sizes`);
      router.refresh();

      toast({
        variant: 'default',
        title: 'Size deleted',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Make sure you removed all products using this size first.',
      });
    } finally {
      setOpen(false); // Close the modal
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isLoading} />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && ( // Only show delete button if there is an initialData
          <Button variant='destructive' size='icon' onClick={() => setOpen(true)} disabled={isLoading}>
            <Trash2 className='size-4' />
          </Button>
        )}
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
                    <Input placeholder='Size name' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder='Size value' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <Button type='submit' disabled={isLoading} className='min-w-[150px] ml-auto'>
            {isLoading ? <Icons.spinner className='h-4 w-4 animate-spin' /> : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
