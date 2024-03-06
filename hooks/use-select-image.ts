import { create } from 'zustand';

interface IUseSelectedImages {
  selectedImages?: File[];
  onSelectImages: (images: File[]) => void;
}

export const useSelectedImages = create<IUseSelectedImages>((set) => ({
  selectedImages: [],
  onSelectImages: (images) => set({ selectedImages: images }),
}));
