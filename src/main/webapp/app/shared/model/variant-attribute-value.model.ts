import { IProductVariant } from 'app/shared/model/product-variant.model';
import { IProductAttributeValue } from 'app/shared/model/product-attribute-value.model';

export interface IVariantAttributeValue {
  id?: number;
  variant?: IProductVariant | null;
  attributeValue?: IProductAttributeValue | null;
}

export const defaultValue: Readonly<IVariantAttributeValue> = {};
