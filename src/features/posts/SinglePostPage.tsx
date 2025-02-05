import { Link, useParams } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'
import { selectPostById } from './postsSlice'
import { selectCurrentUser } from '../users/usersSlice'

import PostAuthor from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import ReactionButtons from './ReactionButtons'

import { useGetPostQuery } from '@/features/api/apiSlice'
import { Spinner } from '@/components/Spinner'

const SinglePostPage = () => {
  const { postId } = useParams()

  const user = useAppSelector(selectCurrentUser)

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId!)

  
  let content: React.ReactNode
  const canEdit = post?.user === user?.id

  if(isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
        <ReactionButtons post={post} />
        {canEdit && <Link to={`/editPost/${post.id}`} className="button">Edit Post</Link>}
      </article>
    )
  }

  return <section>{ content }</section>
}

export default SinglePostPage;