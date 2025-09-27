import { IProduct } from 'app/shared/model/product.model';

export interface IProductVariant {
  id?: number;
  sku?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
  product?: IProduct | null;
}

export const defaultValue: Readonly<IProductVariant> = {};
