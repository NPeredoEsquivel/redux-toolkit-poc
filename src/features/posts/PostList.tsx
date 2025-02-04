import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { Spinner } from '@/components/Spinner'
import ReactionButtons from './ReactionButtons'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'


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
  //Calling the useGetPostsQuery hook automatically fetches the data.
  const {
    data: posts = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery()

  let content: React.ReactNode
  
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = posts.map(post => (
      <PostExceprt key={post.id} post={post} />
    ))
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostList;