'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { AlertModal } from '@/components/modals/alert-modal';
import { useOrigin } from '@/hooks/use-origin';
import ImageUpload from '@/components/ui/image-upload';
import { uploadBillboardImage } from '@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/_actions';
import { useBillboardSelectedImage } from '@/hooks/use-billboard-select-image';

const formSchema = z.object({
  label: z.string().min(1, 'Name is required'),
  imageUrl: z.string().min(1, 'Url is required'),
});

type BillboardFormData = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const { selectedImage } = useBillboardSelectedImage();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const title = initialData ? 'Edit billboard' : 'Create billboard';
  const description = initialData ? 'Update your billboard.' : 'Create a new billboard.';
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<BillboardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: BillboardFormData) => {
    try {
      if (data.label === initialData?.label && data.imageUrl === initialData?.imageUrl) {
        toast({
          variant: 'destructive',
          title: 'You need to change at least one field',
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
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={(url) => {
                      field.onChange(url);
                      uploadBillboardImage(selectedImage)
                        .then((path) => {})
                        .catch((error) => {
                          console.error(error);
                        });
                    }}
                    onRemove={() => {
                      field.onChange('');
                    }}
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder='Billboard label' disabled={isLoading} {...field} />
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
      <Separator />
    </>
  );
};
