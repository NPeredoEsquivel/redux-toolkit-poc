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
    /* getUsers: builder.query<User[], void>({
      query: () => '/users'
    }), */
    addReaction: builder.mutation<Post, { postId: string, reaction: ReactionName }>({
      query: ({postId, reaction}) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        body: { reaction },
      }),
      //the invalidated tags can be removed, 
      //since we are going to do optimistic updates
      /* invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId }
      ] */
      async onQueryStarted({postId, reaction}, lifecycleApi) {
        //`updateQueryData` requires the endpoint name and cache key arguments,
        //so it knows which piece of cache state to update
        const getPostsPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, draft => {
            //The `draft`is immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find(post => post.id === postId)
            if(post) {
              post.reactions[reaction]++
            }
          })
        )
        //We also have another copy of the same data in the `getPost` cache
        // entry for this post ID, so we need to update taht as well
        const getPostPatchResult= lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPost', postId, draft => {
            if(draft) {
              draft.reactions[reaction]++
            }
          })
        )

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getPostsPatchResult.undo()
          getPostPatchResult.undo()
        }
      }
    })
  })
})
console.log("🚀 ~ apiSlice:", apiSlice)

export const { 
  useGetPostsQuery,
  useGetPostQuery,
  //useGetUsersQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation
} = apiSlice