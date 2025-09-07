import dayjs from 'dayjs';
import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/shared/model/user.model';

export interface IProductReview {
  id?: number;
  rating?: number;
  comment?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  product?: IProduct | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IProductReview> = {};
