import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface ICart {
  id?: number;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ICart> = {};
