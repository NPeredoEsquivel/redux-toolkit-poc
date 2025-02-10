import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type { Post, NewPost, PostUpdate } from '@/features/posts/postsSlice'
import { argv } from 'process'
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
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post', id}) as const)
      ],
    }),
    getPost: builder.query<Post, string>({
      query: postId => `posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Post', id: postId }]
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: initialPost => ({
        //The HTTP URL will be 'fakeApi/posts'
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post']
    }),
    editPost: builder.mutation<Post, PostUpdate>({
      query: post => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }]
    }),
  })
})

export const { 
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
} = apiSlice