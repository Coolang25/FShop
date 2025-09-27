import { ICategory } from 'app/shared/model/category.model';
import { IProductVariant } from 'app/shared/model/product-variant.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  basePrice?: number | null;
  imageUrl?: string | null;
  categories?: ICategory[] | null;
  variants?: IProductVariant[] | null;
  isActive?: boolean;
}

export const defaultValue: Readonly<IProduct> = {};
