export type Product = {
  _id: string;
  images: string[];
  imagesId: string[];
  categoryId: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
