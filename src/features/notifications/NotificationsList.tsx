import { useLayoutEffect } from 'react'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from '@/app/hooks' 

import { TimeAgo } from '@/components/TimeAgo'

import PostAuthor from '../posts/PostAuthor'

import { allNotificationRead, useGetNotificationsQuery } from './notificationsSlice'


const NotificationsList = () => {
  const dispatch = useAppDispatch()
  //const notifications = useAppSelector(selectAllNotifications)
  const { data: notifications = [] }  = useGetNotificationsQuery()

  useLayoutEffect(() => {
    dispatch(allNotificationRead())
  })

  const renderedNotifications = notifications.map(notification => {
    const notificationClassname = classNames('notification', {
      //new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>
            <PostAuthor userId={notification.user} showPrefix={false} />
          </b>{' '}
          {notification.message}
        </div>
        <TimeAgo timestamp={notification.date} />
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}

export default NotificationsList