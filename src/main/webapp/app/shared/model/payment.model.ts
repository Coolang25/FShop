import dayjs from 'dayjs';
import { IShopOrder } from 'app/shared/model/shop-order.model';
import { PaymentMethod } from 'app/shared/model/enumerations/payment-method.model';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

export interface IPayment {
  id?: number;
  method?: keyof typeof PaymentMethod;
  status?: keyof typeof PaymentStatus;
  amount?: number;
  transactionId?: string | null;
  createdAt?: dayjs.Dayjs | null;
  order?: IShopOrder | null;
}

export const defaultValue: Readonly<IPayment> = {};
