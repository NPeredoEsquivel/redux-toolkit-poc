import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'

import { addNewPost } from './postsSlice'
import { selectCurrentUser } from '@/features/users/usersSlice'
import { useAddNewPostMutation } from '@/features/api/apiSlice'


interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
  postAuthor: HTMLSelectElement
}

interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

const AddPostForm = () => { 
  const user = useAppSelector(selectCurrentUser)!
  const [ addNewPost, {isLoading} ] = useAddNewPostMutation()

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const form = e.currentTarget

    try {
      // Redux Toolkit adds a .unwrap() method to the returned promise.
      // This allows us to access the actual payload value of the fulfilled action.
      //await dispatch(addNewPost({ title, content, user: user.id })).unwrap()
      addNewPost({ title, content, user: user.id }).unwrap

      form.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    } 

  }


  return (
    <section>
      <h2>Add a new post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post title:</label>
        <input type="text" id="postTitle" defaultValue="" required />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue=""
          required
        />
        <button disabled={isLoading}>Save Post</button>
      </form>
    </section>
  )
}

export default AddPostForm;