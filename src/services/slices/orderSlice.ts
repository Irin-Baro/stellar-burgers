import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  userOrders: [],
  currentOrder: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return { ...response.order, ingredients: ingredientIds } as TOrder;
    } catch (err) {
      return rejectWithValue(
        (err as { message?: string })?.message || 'Ошибка оформления заказа'
      );
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (err) {
      return rejectWithValue(
        (err as { message?: string })?.message || 'Не удалось загрузить заказы'
      );
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (err) {
      return rejectWithValue(
        (err as { message?: string })?.message || 'Заказ не найден'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    setUserOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.userOrders = action.payload;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectUserOrders: (state) => state.userOrders,
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) ?? 'Ошибка оформления заказа';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error =
          (action.payload as string) ?? 'Не удалось загрузить заказы';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Заказ не найден';
      });
  }
});

export const { clearOrderModalData, setUserOrders } = orderSlice.actions;
export const {
  selectOrderRequest,
  selectOrderModalData,
  selectUserOrders,
  selectCurrentOrder,
  selectOrderError
} = orderSlice.selectors;
