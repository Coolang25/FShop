import { IProduct } from 'app/shared/model/product.model';

export interface IProductImage {
  id?: number;
  url?: string;
  isMain?: boolean | null;
  product?: IProduct | null;
}

export const defaultValue: Readonly<IProductImage> = {
  isMain: false,
};
