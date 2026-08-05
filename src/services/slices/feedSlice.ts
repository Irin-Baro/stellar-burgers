import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (err) {
      return rejectWithValue(
        (err as { message?: string })?.message ||
          'Не удалось загрузить ленту заказов'
      );
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
    }
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { setFeed } = feedSlice.actions;
export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading
} = feedSlice.selectors;
