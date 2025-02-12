import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllUsers } from '../users/usersSlice'

import { login, selectCurrentUsername } from './authSlice'
import { useEffect } from 'react'
import { useGetUsersQuery } from '@/features/api/apiSlice'

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLInputElement
}

interface LoginPageFormElement extends HTMLFormElement {
  readonly elements: LoginPageFormFields
}

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const {
    data: users = [],
      isLoading,
      isSuccess,
      isError,
      error,
  } = useGetUsersQuery()
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectCurrentUsername)

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElement>) => {
    e.preventDefault()

    const username = e.currentTarget.elements.username.value
    dispatch(login(username))
  }
  
  useEffect(() => {
    if(currentUser){
      navigate('/posts')
    }
  }, [currentUser])
  
  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Welcome to Tweeter!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">User:</label>
        <select name="username" id="username">
          <option value="">Select a user...</option>
          {userOptions}
        </select>
        <button>Log in</button>
      </form>
    </section>
  )
}

export default LoginPage