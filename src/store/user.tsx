'use client';

import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { Provider } from 'react-redux';
import React from 'react';

// TYPES
type User = {
  email: string;
  phrase: string;
};

type UserState = {
  value: User;
};

const initialState: UserState = {
  value: {
    email: '',
    phrase: '',
  },
};

// SLICE
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    logout: (state) => {
      Cookies.remove('token');
      state.value = { email: '', phrase: '' };
    },
  },
});

export const { login, logout } = userSlice.actions;

// STORE
const userStore = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof userStore.getState>;
export type AppDispatch = typeof userStore.dispatch;

// PROVIDER
export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <Provider store={userStore}>{children}</Provider>;

export default userStore;
