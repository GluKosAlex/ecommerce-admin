'use client';

import { Upload } from 'lucide-react';
import { DropzoneProps, useDropzone } from 'react-dropzone';

interface IDropZoneProps extends DropzoneProps {
  onDrop: DropzoneProps['onDrop'];
}

const DropZone: React.FC<IDropZoneProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps({
        role: 'button',
        'aria-label': 'drag and drop area',
        className: `relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center`,
      })}
    >
      <input
        {...getInputProps({
          'aria-label': 'upload files',
          'aria-describedby': 'file-upload-button',
        })}
      />
      <Upload size={150} strokeWidth={3} className='text-gray-100 absolute z-0' />
      {isDragActive ? (
        <p className='text-gray-500 z-1 relative'>Drop the files here ...</p>
      ) : (
        <p className='text-gray-500 z-1 relative'>
          Drag &apos;n&apos; drop an image file here, or click to select files
        </p>
      )}
    </div>
  );
};

export default DropZone;
