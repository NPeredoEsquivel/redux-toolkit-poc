import { Link } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'

import { selectAllUsers } from './usersSlice'


const UserList = () => {
  const users = useAppSelector(selectAllUsers)
  const renderedUsers = users.map(singleUser => (
    <li key={singleUser.id}>
      <Link to={`/users/${singleUser.id}`}>{singleUser.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {renderedUsers}
      </ul>
    </section>
  )
}

export default UserList