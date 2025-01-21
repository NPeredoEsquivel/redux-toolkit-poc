import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { sub } from 'date-fns'

import { userLoggedOut } from '../auth/authSlice';
import { error } from 'console';

interface PostsState {
  posts: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
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
    builder.addCase(userLoggedOut, (state) => {
      return initialState
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