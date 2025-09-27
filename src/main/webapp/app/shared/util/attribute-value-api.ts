import { AppDispatch } from 'app/config/store';
import { createEntity as createProductAttributeValue } from 'app/entities/product-attribute-value/product-attribute-value.reducer';
import { getEntities as getProductAttributes } from 'app/entities/product-attribute/product-attribute.reducer';
import { IProductAttributeValue } from 'app/shared/model/product-attribute-value.model';
import { IProductAttribute } from 'app/shared/model/product-attribute.model';

/**
 * Creates a new attribute value with just value and attributeId
 * @param dispatch - Redux dispatch function
 * @param data - Object containing value and attributeId
 * @returns Promise with the created attribute value
 *
 * @example
 * ```typescript
 * import { useAppDispatch } from 'app/config/store';
 * import { createAttributeValueAPI } from 'app/shared/util/attribute-value-api';
 *
 * const MyComponent = () => {
 *   const dispatch = useAppDispatch();
 *
 *   const handleCreateValue = async () => {
 *     try {
 *       const result = await createAttributeValueAPI(dispatch, { value: "XS", attributeId: 1 });
 *       console.log('Created attribute value:', result);
 *     } catch (error) {
 *       console.error('Error creating attribute value:', error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleCreateValue}>
 *       Create XS Value for Attribute 1
 *     </button>
 *   );
 * };
 * ```
 */
export const createAttributeValueAPI = async (dispatch: AppDispatch, data: { value: string; attributeId: number }): Promise<any> => {
  const result = await dispatch(createProductAttributeValue(data));
  // Chỉ gọi lại API get attributes để cập nhật giao diện
  await dispatch(getProductAttributes({ page: 0, size: 1000, sort: 'id,asc' }));

  return result;
};

/**
 * Creates multiple attribute values at once
 * @param dispatch - Redux dispatch function
 * @param values - Array of objects with attributeId and value
 * @returns Promise with array of created attribute values
 *
 * @example
 * ```typescript
 * const values = [
 *   { attributeId: 1, value: 'Red' },
 *   { attributeId: 1, value: 'Blue' },
 *   { attributeId: 2, value: 'Small' }
 * ];
 * await createMultipleAttributeValues(dispatch, values);
 * ```
 */
export const createMultipleAttributeValues = async (
  dispatch: AppDispatch,
  values: Array<{ attributeId: number; value: string }>,
): Promise<any[]> => {
  const results = [];

  for (const valueData of values) {
    const result = await createAttributeValueAPI(dispatch, valueData);
    results.push(result);
  }

  return results;
};
