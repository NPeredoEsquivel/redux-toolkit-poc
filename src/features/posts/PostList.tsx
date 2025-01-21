import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import PostAuthor from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { Spinner } from '@/components/Spinner'
import ReactionButtons from './ReactionButtons'
import { Post, fetchPosts, selectAllPosts, selectPostsStatus, selectPostsError } from './postsSlice'


type TPostExceprtProps = {
  post: Post
}

function PostExceprt({ post }: TPostExceprtProps) {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

const PostList = () => {
  const posts = useAppSelector(selectAllPosts)
  const dispatch = useAppDispatch()
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => (
      <PostExceprt key={post.id} post={post} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostList;