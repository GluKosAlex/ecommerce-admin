'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';
import { DropzoneProps, FileRejection } from 'react-dropzone';

import { useSelectedImages } from '@/hooks/use-select-image';

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
  onChange: (value: { url: string }[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  disabled?: boolean;
  maxFiles?: number;
  multiple?: boolean;
}

const ImageUpload = ({ onChange, onRemove, value, disabled, maxFiles, multiple }: ImageUploadProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { onSelectImages } = useSelectedImages();

  useEffect(() => {
    setIsClient(true); // To prevent Next.js Hydration errors https://nextjs.org/docs/messages/react-hydration-error
  }, []);

  const onDrop: DropzoneProps['onDrop'] = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length > 0) {
        onSelectImages(acceptedFiles);

        const acceptedFilesUrls = acceptedFiles.map((file) => {
          return { url: URL.createObjectURL(file) };
        });
        // const acceptedFilesUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

        onChange(acceptedFilesUrls);

        setIsOpen(false);
      }

      if (rejectedFiles?.length > 0) {
      } // TODO: Handle rejected files
    },
    [onChange, onSelectImages]
  );

  return !isClient ? null : (
    <>
      <div>
        <div className='mb-4 flex items-center gap-4'>
          {value.map((url) => {
            return (
              <div
                key={url}
                className='relative w-[200px] h-[200px] overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800'
              >
                <div className='z-10 absolute top-2 right-2 cursor-pointer'>
                  <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='icon'>
                    <Trash className='h-4 w-4' />
                  </Button>
                </div>
                <Image src={url} alt='Uploaded image' fill className='h-full w-full object-cover' />
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
            <DropZone multiple={multiple || false} maxFiles={maxFiles || 1} onDrop={onDrop} />
            <DialogDescription className='pt-2'>File should be .jpg or .png up to 5MB</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
