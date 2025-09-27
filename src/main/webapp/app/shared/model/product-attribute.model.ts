import { IProductAttributeValue } from './product-attribute-value.model';

export interface IProductAttribute {
  id?: number;
  name?: string;
  values?: IProductAttributeValue[];
}

export const defaultValue: Readonly<IProductAttribute> = {};
