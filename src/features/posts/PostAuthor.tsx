import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectUserById } from '../users/usersSlice'

type TPostAuthorProps = {
  userId: string
  showPrefix?: boolean
}

const PostAuthor = ({ userId, showPrefix = true }: TPostAuthorProps) => {
  const author = useAppSelector(state => selectUserById(state, userId))

  return (
    <span>
      {showPrefix ? 'by ' : null}
      {author?.name ?? 'Unknown author'}
    </span>
  )
}

export default PostAuthor