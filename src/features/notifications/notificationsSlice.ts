import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/withTypes";
import { client } from "@/api/client";

import { RootState } from "@/app/store";

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

const initialState: ClientNotification[] = []

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationRead(state) {
      state.forEach(notification =>
        notification.read = true
      )
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationWithMetadata: ClientNotification[] =
        action.payload.map(notification => ({
          ...notification,
          read: false,
          isNew: true
        }))
      state.forEach(notification => {
        // Mark any existing notifications as not new
        notification.isNew = !notification.read
      })

      state.push(...notificationWithMetadata)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  }
})

export default notificationSlice.reducer

export const { allNotificationRead } = notificationSlice.actions

export const selectAllNotifications = (state: RootState) => state.notifications
export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    notification => !notification.read
  )

  return unreadNotifications.length
}