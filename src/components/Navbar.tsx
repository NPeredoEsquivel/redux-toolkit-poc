import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { userLoggedOut } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'

import { UserIcon } from './UserIcon'
import React from 'react'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  console.log("🚀 ~ Navbar ~ user:", user)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(userLoggedOut())
    }
    console.log("🚀 0~ Navbar ~ isLoggedIn:", isLoggedIn)

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/">Posts</Link>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user && user.name}
          <button className="button small" onClick={onLogoutClicked}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  )
}
