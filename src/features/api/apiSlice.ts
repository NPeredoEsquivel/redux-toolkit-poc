import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type { Post } from '../posts/postsSlice'
export type { Post }

export const apiSlice = createApi({
  reducerPath: 'api',
  //All of the URLs will start with fakeApi.
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  //operations and requests for this server.
  endpoints: builder => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts'
    })
  })
})

export const { useGetPostsQuery } = apiSlice