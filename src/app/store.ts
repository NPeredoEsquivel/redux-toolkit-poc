import { configureStore } from '@reduxjs/toolkit';

import postReducer from '../features/posts/postsSlice';
import userReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import { apiSlice } from '@/features/api/apiSlice';

import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlice.middleware)
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;