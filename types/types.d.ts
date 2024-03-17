interface IProductDataRequest {
  name: string;
  price: number;
  categoryId: string;
  colorId: string;
  sizeId: string;
  images: { url: string }[];
  isFeatured?: boolean;
  isArchived?: boolean;
}
