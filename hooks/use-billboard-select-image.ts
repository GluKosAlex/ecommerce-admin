import { create } from 'zustand';

interface IUseBillboardSelectedImage {
  selectedImage?: FormData;
  onSelectImage: (data: FormData) => void;
}

export const useBillboardSelectedImage = create<IUseBillboardSelectedImage>((set) => ({
  selectedImage: undefined,
  onSelectImage: (data) => set({ selectedImage: data }),
}));
