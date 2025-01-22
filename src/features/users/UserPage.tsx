import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectPostsByUserId } from '../posts/postsSlice'
import { selectUserById } from './usersSlice'

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>()

  const user = useAppSelector(state => selectUserById(state, userId!))

  const postsForUser = useAppSelector(state => selectPostsByUserId(state, userId!))

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}

export default UserPage