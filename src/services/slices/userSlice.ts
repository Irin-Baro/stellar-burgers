import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthRequest: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthRequest: false,
  error: null
};

const getErrorMessage = (err: unknown, fallback: string) =>
  (err as { message?: string })?.message || fallback;

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка регистрации'));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Неверный логин или пароль'));
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, 'Не удалось получить данные пользователя')
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка обновления данных'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка выхода из системы'));
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => dispatch(authChecked()));
    } else {
      dispatch(authChecked());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthRequest: (state) => state.isAuthRequest,
    selectAuthError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isAuthRequest = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthRequest = false;
        state.error = (action.payload as string) ?? 'Ошибка регистрации';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthRequest = false;
        state.user = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthRequest = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthRequest = false;
        state.error = (action.payload as string) ?? 'Неверный логин или пароль';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthRequest = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error =
          (action.payload as string) ??
          'Не удалось получить данные пользователя';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthRequest = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isAuthRequest = false;
        state.error = (action.payload as string) ?? 'Ошибка обновления данных';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthRequest = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Ошибка выхода из системы';
      });
  }
});

export const { authChecked } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthRequest,
  selectAuthError
} = userSlice.selectors;
