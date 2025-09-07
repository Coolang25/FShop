import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IChatbotLog {
  id?: number;
  question?: string;
  answer?: string | null;
  createdAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IChatbotLog> = {};
