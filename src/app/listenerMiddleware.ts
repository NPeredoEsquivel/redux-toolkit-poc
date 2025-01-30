import { createListenerMiddleware, addListener } from "@reduxjs/toolkit"
import {RootState, AppDispatch } from './store'

import { addPostListener } from '@/features/posts/postsSlice'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()

export type AppStartListening = typeof startAppListening

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
export type AppAddListener = typeof addAppListener

addPostListener(startAppListening)