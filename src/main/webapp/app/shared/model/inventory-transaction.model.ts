import dayjs from 'dayjs';
import { IProductVariant } from 'app/shared/model/product-variant.model';
import { IShopOrder } from 'app/shared/model/shop-order.model';

export enum TransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface IInventoryTransaction {
  id?: number;
  type?: TransactionType;
  quantity?: number;
  note?: string;
  createdAt?: dayjs.Dayjs | null;
  variant?: IProductVariant | null;
  order?: IShopOrder | null;
}

export const defaultValue: Readonly<IInventoryTransaction> = {};
