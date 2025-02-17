import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'
import { /* fetchNotifications */fetchNotificationsWebsocket, selectUnreadNotificationsCount } from '@/features/notifications/notificationsSlice'

import { UserIcon } from './UserIcon'
import React from 'react'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const numberUnreadNotifications = useAppSelector(selectUnreadNotificationsCount)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  
  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout())
    }

    const fetchNewNotifications = () => {
      dispatch<any>(fetchNotificationsWebsocket())
    }

    let unreadNotificationsBadge: React.ReactNode | undefined

    if (numberUnreadNotifications > 0) {
      unreadNotificationsBadge = <span className="badge">{numberUnreadNotifications}</span>
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
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
