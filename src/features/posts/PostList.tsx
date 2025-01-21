import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import PostAuthor from './PostAuthor'
import TimeAgo from '@/components/TimeAgo'
import ReactionButtons from './ReactionButtons'
import { fetchPosts, selectAllPosts, selectPostsStatus } from './postsSlice'


const PostList = () => {
  const posts = useAppSelector(selectAllPosts)
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  const dispatch = useAppDispatch()
  const postStatus = useAppSelector(selectPostsStatus)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  const renderedPosts = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`} >{post.title}</Link>
      </h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons post={post} />
    </article>
  ))

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}

export default PostList;