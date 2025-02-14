import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/withTypes";
import { client } from "@/api/client";

import { RootState, AppThunk } from "@/app/store";

import { forceGenerateNotifications } from "@/api/server";

import { apiSlice } from "@/features/api/apiSlice";


export interface ServerNotification {
  id: string;
  date: string;
  message: string;
  user: string;
}

export interface ClientNotification extends ServerNotification {
  read: boolean;
  isNew: boolean;
}

export const fetchNotifications = createAppAsyncThunk<ServerNotification[]>(
  'notifications/fetchNotifications',
  async (_unused, thunkApi) => {
    const allNotifications = selectAllNotifications(thunkApi.getState()) as ServerNotification[]
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.data as ServerNotification[]
  }

)

const notificationsAdapter = createEntityAdapter<ClientNotification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = notificationsAdapter.getInitialState()

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationRead(state) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })      
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: ClientNotification[] =
        action.payload.map(notification => ({
          ...notification,
          read: false,
          isNew: true
        }))
      Object.values(state.entities).forEach(notification => {
        // Mark any existing notifications as not new
        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, notificationsWithMetadata)
    })
  }
})

export default notificationSlice.reducer

export const { allNotificationRead } = notificationSlice.actions

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)
export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    notification => !notification.read
  )

  return unreadNotifications.length
}

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  })
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications