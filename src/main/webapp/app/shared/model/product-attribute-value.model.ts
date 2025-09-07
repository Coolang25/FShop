import { IProductAttribute } from 'app/shared/model/product-attribute.model';

export interface IProductAttributeValue {
  id?: number;
  value?: string;
  attribute?: IProductAttribute | null;
}

export const defaultValue: Readonly<IProductAttributeValue> = {};
