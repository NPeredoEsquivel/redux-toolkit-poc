import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'
import { fetchNotifications } from '@/features/notifications/notificationsSlice'

import { UserIcon } from './UserIcon'
import React from 'react'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout())
    }
    console.log("🚀 0~ Navbar ~ isLoggedIn:", isLoggedIn)

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/">Posts</Link>
          <Link to="/users">Users</Link><Link to="/notifications">Notifications</Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
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
