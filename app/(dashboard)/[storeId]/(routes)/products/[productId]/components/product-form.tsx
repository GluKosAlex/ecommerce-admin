'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { deleteProductImages, uploadProductImages } from '@/app/api/actions/_actions';

import { useSelectedImages } from '@/hooks/use-select-image';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  images: z.object({ url: z.string() }).array().min(1, 'At least one image is required'),
  price: z.coerce.number().min(1, 'Price is required'), // coerce the price to be a number
  categoryId: z.string().min(1, 'Category is required'),
  colorId: z.string().min(1, 'Color is required'),
  sizeId: z.string().min(1, 'Size is required'),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, colors, sizes }) => {
  const params = useParams();
  const router = useRouter();

  const { selectedImages } = useSelectedImages();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Update your product.' : 'Create a new product.';
  const toastMessage = initialData ? 'Product updated' : 'Product created';
  const action = initialData ? 'Update' : 'Create';

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)), // Convert the price to a number from Decimal
        }
      : {
          name: '',
          images: [],
          price: 0,
          categoryId: '',
          colorId: '',
          sizeId: '',
          isFeatured: false,
          isArchived: false,
        },
  });

  const {
    formState: { isDirty },
  } = form;

  const { toast } = useToast();

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (!isDirty) {
        toast({
          variant: 'destructive',
          title: 'You need to change at least one field',
        });
        return;
      }

      setIsLoading(true);

      // Filter out the temporary blob image URLs
      const images: string[] = data.images.map((image) => image.url);
      const addedImages: string[] = images.filter((url) => url.startsWith('blob:'));

      // Create a FormData object with the selected images as files
      if (addedImages && selectedImages) {
        const formData = new FormData();
        selectedImages.forEach((image) => {
          formData.append('images', image);
        });

        const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId; // Get the store ID from the URL

        // Delete images from the server that were removed from the form
        if (initialData) {
          const initialImages = initialData.images.map((image) => image.url); // Get the initial image URLs
          const removedImages = initialImages.filter((url) => !images.includes(url)); // Find the images that were removed
          if (removedImages) {
            deleteProductImages(removedImages, storeId); // Delete the removed images from the server
          }
        }

        const newImagesUrls = await uploadProductImages(formData, storeId); // Upload the new images files and get the new images URLs

        // Replace the temporary blob image URLs with the uploaded new image URLs
        data.images.forEach((image, i, arr) => {
          if (image.url.startsWith('blob:')) {
            const index = images.indexOf(image.url); // Find the index of the image in the array of image URLs
            arr[index].url = newImagesUrls.shift() as string; // Replace the image URL with the new image URL
          }
        });
      }

      if (initialData) {
        // Update existing product if initialData is defined
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        // Create new product
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.push(`/${params.storeId}/products`); // Redirect to the product list
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      router.push(`/${params.storeId}/products`);
      router.refresh();

      toast({
        variant: 'default',
        title: 'Product deleted',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
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
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={(url) => {
                      field.onChange([...field.value, ...url]);
                    }}
                    onRemove={(url) => {
                      field.onChange([...field.value.filter((currentImage) => currentImage.url !== url)]);
                    }}
                    value={field.value.map((image) => image.url)}
                    disabled={isLoading}
                    multiple
                    maxFiles={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder='Product name' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='9.99' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a category'></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sizeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a size'></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='colorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a color'></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}></Checkbox>
                  </FormControl>
                  <div className='space-y-2 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>Featured products appear on the home page.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}></Checkbox>
                  </FormControl>
                  <div className='space-y-2 leading-none'>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>This product will not displayed in the store.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </fieldset>
          <Button
            type='submit'
            disabled={isLoading || !form.formState.isValid}
            className='min-w-[150px] ml-auto'
          >
            {isLoading ? <Icons.spinner className='h-4 w-4 animate-spin' /> : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
