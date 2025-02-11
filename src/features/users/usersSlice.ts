import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { selectCurrentUsername } from '../auth/authSlice';

import { client } from '@/api/client';

import { createAppAsyncThunk } from '@/app/withTypes';
import { apiSlice } from '@/features/api/apiSlice';

export interface User {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers',
  async () => {
    const response = await client.get<User[]>('fakeApi/users')
    return response.data
  }
)

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  }
})

const emptyUsers: User[] = []


//This generates a new selector that will return the query result object for a query with those parameters.
//To generate a selector for a specific query argument, call 'select(theQueryArg)`.
//In this case, the users query has no params, so we don't pass anything to select().
export const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(
  selectUsersResult,
  usersResult => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
  selectAllUsers,
  (state: RootState, userId: string) => userId,
  (users, userId) => users.find(user => user.id === userId)
)

export const { } = usersSlice.actions
export default usersSlice.reducer


/* export const { selectAll: selectAllUsers, selectById: selectUserById  } = usersAdapter.getSelectors((state: RootState) => state.users) */

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) return
  return selectUserById(state, currentUsername!)
}