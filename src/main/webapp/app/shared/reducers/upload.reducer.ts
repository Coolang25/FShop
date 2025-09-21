import axios from 'axios';
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

export interface UploadResponse {
  fileName: string;
  fileUrl: string;
  originalName: string;
  size: string;
  contentType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadState {
  loading: boolean;
  errorMessage: string | null;
  uploadProgress: UploadProgress | null;
  uploadedUrl: string | null;
  uploadSuccess: boolean;
}

const initialState: UploadState = {
  loading: false,
  errorMessage: null,
  uploadProgress: null,
  uploadedUrl: null,
  uploadSuccess: false,
};

const apiUrl = 'api';

// Async Actions
export const uploadImage = createAsyncThunk(
  'upload/upload_image',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(`${apiUrl}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            };
            dispatch(setUploadProgress(progress));
          }
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
  { serializeError: serializeAxiosError },
);

export const deleteImage = createAsyncThunk(
  'upload/delete_image',
  async (imageUrl: string, { rejectWithValue }) => {
    try {
      // Extract fileName from URL (e.g., "/api/files/img_20231201_123456_abc123.jpg" -> "img_20231201_123456_abc123.jpg")
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      const response = await axios.delete(`${apiUrl}/upload/files/${fileName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(serializeAxiosError(error));
    }
  },
  { serializeError: serializeAxiosError },
);

// Slice
export const UploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress(state) {
      state.uploadProgress = null;
    },
    clearUploadedUrl(state) {
      state.uploadedUrl = null;
    },
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(uploadImage.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadSuccess = true;
        state.uploadedUrl = action.payload.fileUrl;
        state.uploadProgress = null;
        state.errorMessage = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.uploadSuccess = false;
        state.errorMessage = action.payload as string;
        state.uploadProgress = null;
      })
      .addCase(deleteImage.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(deleteImage.fulfilled, state => {
        state.loading = false;
        state.uploadedUrl = null;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setUploadProgress, clearUploadProgress, clearUploadedUrl, reset } = UploadSlice.actions;

// Reducer
export default UploadSlice.reducer;
