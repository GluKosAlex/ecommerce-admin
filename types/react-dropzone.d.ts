import type { DropzoneProps } from 'react-dropzone';

type CustomFile = File & { preview?: string };

declare module 'react-dropzone' {
  interface DropzoneProps {
    onDrop: <T extends CustomFile>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => void;
  }
}
