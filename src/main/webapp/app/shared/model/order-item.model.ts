import { IShopOrder } from 'app/shared/model/shop-order.model';
import { IProductVariant } from 'app/shared/model/product-variant.model';

export interface IOrderItem {
  id?: number;
  quantity?: number;
  price?: number;
  order?: IShopOrder | null;
  variant?: IProductVariant | null;
}

export const defaultValue: Readonly<IOrderItem> = {};
