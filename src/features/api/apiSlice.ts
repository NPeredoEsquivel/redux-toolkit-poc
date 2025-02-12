import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import type { Post, NewPost, PostUpdate, ReactionName } from '@/features/posts/postsSlice'
import type { User } from '@/features/users/usersSlice'
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
    getUsers: builder.query<User[], void>({
      query: () => '/users'
    }),
    addReaction: builder.mutation<Post, { postId: string, reaction: ReactionName }>({
      query: ({postId, reaction}) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId }
      ]
    })
  })
})
console.log("🚀 ~ apiSlice:", apiSlice)

export const { 
  useGetPostsQuery,
  useGetPostQuery,
  useGetUsersQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation
} = apiSlice