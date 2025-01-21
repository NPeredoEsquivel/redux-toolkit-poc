import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { userLoggedOut } from '../auth/authSlice';

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

interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null
}

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

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        const newPosts = [...state.posts, action.payload]
        return { ...state, posts: newPosts }
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: { ...initialReactions },
          },
        }
      }
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload
      const posts = state.posts
      const updatedPosts = posts.map(post => (post.id === id ? { ...post, title, content } : post))
      return { ...state, updatedPosts }
    },
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>
    ) {
      const { postId, reaction } = action.payload
      const updatedPosts = state.posts.map(post =>
        post.id === postId ? { ...post, reactions: { ...post.reactions, [reaction]: post.reactions[reaction] + 1 } } : post
      )
      return { ...state, posts: updatedPosts }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoggedOut, (state) => {
        return initialState
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = [...state.posts, ...action.payload];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown'
      })
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = (state: RootState) => state.posts.posts
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find(post => post.id === postId)
export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error