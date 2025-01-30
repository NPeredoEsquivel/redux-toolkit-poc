import { createSlice, PayloadAction, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AppStartListening } from '@/app/listenerMiddleware';

import { logout } from '../auth/authSlice';

import { client } from '../../api/client';
import { createAppAsyncThunk } from '../../app/withTypes'


//Accepts two arguments:
//1. A string that will be used as the prefix for the generated action types
//2. A function that returns a Promise containing the data you want to fetch
export const fetchPosts = createAppAsyncThunk('posts/fetchPosts',
  async () => {
    const response = await client.get<Post[]>('fakeApi/posts')
    return response.data
  },
  {
    condition(arg, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    }
  }
)

interface PostsState extends EntityState<Post, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const postAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState: PostsState = postAdapter.getInitialState({
  status: 'idle',
  error: null
})

export interface Post {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}

export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

export const addNewPost = createAppAsyncThunk('posts/addNewPost',
  async (initialPost: NewPost) => {
    const response = await client.post<Post>('fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload
      postAdapter.updateOne(state, { id, changes: { title, content } })
    },
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]

      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        return initialState
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postAdapter.setAll(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown'
      })
      .addCase(addNewPost.fulfilled, postAdapter.addOne)
  }
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUserId = createSelector(
  [
    selectAllPosts,
    (state: RootState, userId: string) => userId
  ],
  (posts, userId) => posts.filter(post => post.user === userId)
)

export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error

export const addPostListener = (startAppListening: AppStartListening) => {
  startAppListening(
    {
      actionCreator: addNewPost.fulfilled,
      effect: async (action, listenerApi) => {
        const { toast } = await import('react-tiny-toast')

        const toastId = toast.show('New post added!', {
          variant: 'success',
          position: 'bottom-right',
          pause: true
        })

        await listenerApi.delay(5000)
        toast.remove(toastId)
      }
    }
  )
}