import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { postUpdated, selectPostById } from '@/features/posts/postsSlice'
import { useGetPostQuery, useEditPostMutation } from '@/features/api/apiSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

const EditPostForm = () => {
  const { postId } = useParams()

  const navigate = useNavigate()
  const { data: post } = useGetPostQuery(postId!)

  const [ updatePost, { isLoading } ] = useEditPostMutation()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      await updatePost({ ...post, title, content })
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id='postTitle'
          name='postTitle'
          defaultValue={post.title}
          required
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          defaultValue={post.content}
          required
        />
        <button>Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm