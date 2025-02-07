import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type { Post, NewPost } from '@/features/posts/postsSlice'
export type { Post }

export const apiSlice = createApi({
  reducerPath: 'api',
  //All of the URLs will start with fakeApi. This also helps the body to be JSON-serialized.
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  //operations and requests for this server.
  endpoints: builder => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, string>({
      query: postId => `posts/${postId}`
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: initialPost => ({
        //The HTTP URL will be 'fakeApi/posts'
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post']
    })
  })
})

export const { 
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation
} = apiSlice