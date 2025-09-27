import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IProductAttribute, defaultValue } from 'app/shared/model/product-attribute.model';

// Types for simplified API
export interface AttributeValue {
  id: number;
  value: string;
}

export interface AttributeWithValues {
  id: number;
  name: string;
  values: AttributeValue[];
}

const initialState: EntityState<IProductAttribute> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/product-attributes';

// Actions

export const getEntities = createAsyncThunk(
  'productAttribute/fetch_entity_list',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IProductAttribute[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntitiesSimplified = createAsyncThunk(
  'productAttribute/fetch_entity_list_simplified',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`;
    return axios.get<AttributeWithValues[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'productAttribute/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IProductAttribute>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'productAttribute/create_entity',
  async (entity: IProductAttribute, thunkAPI) => {
    const result = await axios.post<IProductAttribute>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'productAttribute/update_entity',
  async (entity: IProductAttribute, thunkAPI) => {
    const result = await axios.put<IProductAttribute>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'productAttribute/partial_update_entity',
  async (entity: IProductAttribute, thunkAPI) => {
    const result = await axios.patch<IProductAttribute>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'productAttribute/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IProductAttribute>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// Attribute Value Actions
const attributeValueApiUrl = 'api/product-attribute-values';

export const createAttributeValue = createAsyncThunk(
  'productAttribute/create_attribute_value',
  async ({ value, attributeId }: { value: string; attributeId: number }, thunkAPI) => {
    const result = await axios.post(attributeValueApiUrl, { value, attributeId });
    thunkAPI.dispatch(getEntitiesSimplified());
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateAttributeValue = createAsyncThunk(
  'productAttribute/update_attribute_value',
  async ({ id, value, attributeId }: { id: number; value: string; attributeId: number }, thunkAPI) => {
    const result = await axios.put(`${attributeValueApiUrl}/${id}`, { value, attributeId });
    thunkAPI.dispatch(getEntitiesSimplified());
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteAttributeValue = createAsyncThunk(
  'productAttribute/delete_attribute_value',
  async (id: number, thunkAPI) => {
    const result = await axios.delete(`${attributeValueApiUrl}/${id}`);
    thunkAPI.dispatch(getEntitiesSimplified());
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ProductAttributeSlice = createEntitySlice({
  name: 'productAttribute',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(getEntitiesSimplified), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(createAttributeValue, updateAttributeValue, deleteAttributeValue), state => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getEntities, getEntitiesSimplified, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(
        isPending(
          createEntity,
          updateEntity,
          partialUpdateEntity,
          deleteEntity,
          createAttributeValue,
          updateAttributeValue,
          deleteAttributeValue,
        ),
        state => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.updating = true;
        },
      );
  },
});

export const { reset } = ProductAttributeSlice.actions;

// Reducer
export default ProductAttributeSlice.reducer;
