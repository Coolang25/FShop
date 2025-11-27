import { IProduct } from 'app/shared/model/product.model';

export interface IProductAttributeValue {
  id?: number;
  value?: string;
  attribute?: {
    id?: number;
    name?: string;
  };
}

export interface IProductVariant {
  id?: number;
  sku?: string;
  price?: number;
  stock?: number;
  reserved?: number;
  available?: number;
  imageUrl?: string;
  isActive?: boolean;
  product?: IProduct | null;
  attributeValues?: IProductAttributeValue[];
}

export const defaultValue: Readonly<IProductVariant> = {};
