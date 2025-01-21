import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectUserById } from '../users/usersSlice'

type TPostAuthorProps = {
  userId: string
}

const PostAuthor = ({ userId }: TPostAuthorProps) => {
  const author = useAppSelector(state => selectUserById(state, userId))

  return (
    <span>by {author ? author.name : 'Unknown author'}</span>
  )
}

export default PostAuthor