import { createSlice, createEntityAdapter, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { selectCurrentUsername } from '../auth/authSlice';

import { client } from '@/api/client';

import { createAppAsyncThunk } from '@/app/withTypes';

interface User {
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

export const { } = usersSlice.actions
export default usersSlice.reducer


export const { selectAll: selectAllUsers, selectById: selectUserById  } = usersAdapter.getSelectors((state: RootState) => state.users)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) return
  return selectUserById(state, currentUsername!)
}