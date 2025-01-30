import { configureStore } from '@reduxjs/toolkit';

import postReducer from '../features/posts/postsSlice';
import userReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;