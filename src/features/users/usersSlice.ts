import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { selectCurrentUsername } from '../auth/authSlice';

interface User {
  id: string
  name: string
}

const initialState: User[] = [
  { id: '0', name: 'Tiago' },
  { id: '1', name: 'Lucas' },
  { id: '2', name: 'Rafael' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export const { } = usersSlice.actions
export default usersSlice.reducer

export const selectAllUsers = (state: RootState) => state.users
export const selectUserById = (state: RootState, userId: string) =>
  state.users.find(user => user.id === userId)
export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  return selectUserById(state, currentUsername!)
}