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

const initialState: ServerNotification[] = []

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  }
})

export default notificationSlice.reducer

export const selectAllNotifications = (state: RootState) => state.notifications