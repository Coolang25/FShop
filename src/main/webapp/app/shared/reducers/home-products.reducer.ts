import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IProduct } from 'app/shared/model/product.model';

const apiUrl = 'api/products';

// Actions for different product types
export const getNewProducts = createAsyncThunk(
  'homeProducts/fetch_new_products',
  async (limit: number = 3) => {
    const requestUrl = `${apiUrl}/new?limit=${limit}`;
    return axios.get<IProduct[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getTrendProducts = createAsyncThunk(
  'homeProducts/fetch_trend_products',
  async (limit: number = 3) => {
    const requestUrl = `${apiUrl}/trend?limit=${limit}`;
    return axios.get<IProduct[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getBestSellerProducts = createAsyncThunk(
  'homeProducts/fetch_best_seller_products',
  async (limit: number = 3) => {
    const requestUrl = `${apiUrl}/best-seller?limit=${limit}`;
    return axios.get<IProduct[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getFeaturedProducts = createAsyncThunk(
  'homeProducts/fetch_featured_products',
  async (limit: number = 8) => {
    const requestUrl = `${apiUrl}/featured?limit=${limit}`;
    return axios.get<IProduct[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// Initial state
interface HomeProductsState {
  newProducts: IProduct[];
  trendProducts: IProduct[];
  bestSellerProducts: IProduct[];
  featuredProducts: IProduct[];
  loading: boolean;
  errorMessage: string | null;
}

const initialState: HomeProductsState = {
  newProducts: [],
  trendProducts: [],
  bestSellerProducts: [],
  featuredProducts: [],
  loading: false,
  errorMessage: null,
};

// Slice
import { createSlice } from '@reduxjs/toolkit';

export const HomeProductsSlice = createSlice({
  name: 'homeProducts',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getNewProducts), (state, action) => {
        state.loading = false;
        state.newProducts = action.payload.data;
      })
      .addMatcher(isFulfilled(getTrendProducts), (state, action) => {
        state.loading = false;
        state.trendProducts = action.payload.data;
      })
      .addMatcher(isFulfilled(getBestSellerProducts), (state, action) => {
        state.loading = false;
        state.bestSellerProducts = action.payload.data;
      })
      .addMatcher(isFulfilled(getFeaturedProducts), (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.data;
      })
      .addMatcher(isPending(getNewProducts, getTrendProducts, getBestSellerProducts, getFeaturedProducts), state => {
        state.errorMessage = null;
        state.loading = true;
      });
  },
});

export const { reset } = HomeProductsSlice.actions;

// Reducer
export default HomeProductsSlice.reducer;
