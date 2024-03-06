'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import { DropzoneProps, FileRejection } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DropZone from '@/components/ui/drop-zone';

interface ImageUploadProps {
  onChange: (value: File[]) => void;
  onRemove: (value: File) => void;
  value: File[];
  disabled?: boolean;
}

const ImageUpload = ({ onChange, onRemove, value, disabled }: ImageUploadProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // To prevent Next.js Hydration errors https://nextjs.org/docs/messages/react-hydration-error
  }, []);

  const onDrop: DropzoneProps['onDrop'] = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length > 0) {
        onChange(acceptedFiles);

        setIsOpen(false);
      }

      if (rejectedFiles?.length > 0) {
      }
    },
    []
  );

  return !isClient ? null : (
    <>
      <div>
        <div className='mb-4 flex items-center gap-4'>
          {value.map((file) => {
            return (
              <div
                key={file.name}
                className='relative w-[200px] h-[200px] overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800'
              >
                <div className='z-10 absolute top-2 right-2 cursor-pointer'>
                  <Button type='button' onClick={() => onRemove(file)} variant='destructive' size='icon'>
                    <Trash className='h-4 w-4' />
                  </Button>
                </div>
                <Image
                  src={file.name ? URL.createObjectURL(file) : ''}
                  alt='Uploaded image'
                  fill
                  className='h-full w-full object-cover'
                />
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type='button' variant='secondary' disabled={disabled}>
            <ImagePlus className='h-4 w-4 mr-2'></ImagePlus> Upload image
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='pb-4 pt-2'> Upload a background image for your billboard</DialogTitle>
            <DropZone onDrop={onDrop} />
            <DialogDescription className='pt-2'>File should be .jpg or .png up to 5MB</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
