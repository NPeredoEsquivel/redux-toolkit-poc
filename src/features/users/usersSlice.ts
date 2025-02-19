import { createSlice, createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { selectCurrentUsername } from '../auth/authSlice';
import { apiSlice } from '@/features/api/apiSlice';
import { createAppAsyncThunk } from '@/app/withTypes';
import { client } from '@/api/client';

export interface User {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()
const initialState = usersAdapter.getInitialState()

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse(res: User[]) {
        //Create a normalized state object containing all the user items.
        console.log("🚀 ~ transformResponse ~ res:", initialState)
        return usersAdapter.setAll(initialState, res)
      }
    })
  })
})

export const { useGetUsersQuery } = apiSliceWithUsers

//This generates a new selector that will return the query result object for a query with those parameters.
//To generate a selector for a specific query argument, call 'select(theQueryArg)`.
//In this case, the users query has no params, so we don't pass anything to select().
//export const selectUsersResult = apiSlice.endpoints.getUsers.select()

//This is the new variable from the mutated apiSlice.
export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  //Fall back to the empty entity state if no response yet.
  result => result.data ?? initialState
)


export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(selectUsersData)



export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers',
  async () => {
    const response = await client.get<User[]>('fakeApi/users')
    return response.data
  }
)

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


