import { ICategory } from 'app/shared/model/category.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  basePrice?: number | null;
  imageUrl?: string | null;
  categories?: ICategory[] | null;
}

export const defaultValue: Readonly<IProduct> = {};
