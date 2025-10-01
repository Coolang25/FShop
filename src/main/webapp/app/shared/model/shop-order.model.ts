import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

export interface IShopOrder {
  id?: number;
  status?: keyof typeof OrderStatus;
  total?: number;
  shippingAddress?: string;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
  orderItems?: IOrderItem[];
}

export const defaultValue: Readonly<IShopOrder> = {};
