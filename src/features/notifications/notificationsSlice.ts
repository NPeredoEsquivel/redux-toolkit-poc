import { createSlice, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

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

export interface NotificationMetadata {
  id: string
  read: boolean;
  isNew: boolean;
}

/* const notificationsAdapter = createEntityAdapter<ClientNotification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})*/

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

/* const initialState = notificationsAdapter.getInitialState() */
const initialState = metadataAdapter.getInitialState()

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationRead(state) {
      /* Object.values(state.entities).forEach(notification => {
        notification.read = true
      }) */
      Object.values(state.entities).forEach(metadata => {
        metadata.read = true
      })
    }
  },
  extraReducers: builder => {
    /* builder.addCase(fetchNotifications.fulfilled, (state, action) => {
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
          }) */
    //Listen for the endpoint `matchFulfilled` actionwith `addMatcher`
    builder.addMatcher(apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled,
      (state, action) => {
        // Add client-side metadata for tracking new notifications
        const notificationsMetadata: NotificationMetadata[] =
          action.payload.map(notification => ({
            //Give the metadata object the same ID as the notification
            id: notification.id,
            read: false,
            isNew: true
          }))

        //Rename to `metadata`
        Object.values(state.entities).forEach(metadata => {
          //Any notification we've read are no longer new
          metadata.isNew = !metadata.read
        })

        metadataAdapter.upsertMany(state, notificationsMetadata)
      })
  }
})

export default notificationSlice.reducer

export const { allNotificationRead } = notificationSlice.actions

export const { 
  selectAll: selectAllNotificationsMetadata,
  selectEntities: selectMetadataEntities
} =
  metadataAdapter.getSelectors((state: RootState) => state.notifications)
/* export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications) */

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter(
    notification => !notification.read
  )

  return unreadNotifications.length
}
/* export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    notification => !notification.read
  )

  return unreadNotifications.length
} */

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  })
})

export const fetchNotifications = createAppAsyncThunk<ServerNotification[]>(
  'notifications/fetchNotifications',
  async (_unused, thunkApi) => {
    /* const allNotifications = selectAllNotifications(thunkApi.getState()) as ServerNotification[]
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : '' */
    const response = await client.get<ServerNotification[]>(`/fakeApi/notifications`)
    return response.data
  }

)

const emptyNotifications: ServerNotification[] = []
export const selectNotificationsResult = apiSliceWithNotifications.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(selectNotificationsResult, notificationsResult => notificationsResult.data ?? emptyNotifications)

export const fetchNotificationsWebsocket = (): AppThunk => (_, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  //Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp)
}


export const { useGetNotificationsQuery } = apiSliceWithNotifications