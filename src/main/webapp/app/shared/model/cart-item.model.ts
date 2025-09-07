import { ICart } from 'app/shared/model/cart.model';
import { IProductVariant } from 'app/shared/model/product-variant.model';

export interface ICartItem {
  id?: number;
  quantity?: number;
  price?: number;
  cart?: ICart | null;
  variant?: IProductVariant | null;
}

export const defaultValue: Readonly<ICartItem> = {};
