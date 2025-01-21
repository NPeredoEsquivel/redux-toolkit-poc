import { parseISO, formatDistanceToNow } from 'date-fns'

type TTimeAgoProps = {
  timestamp: string
}

const TimeAgo = ({ timestamp }: TTimeAgoProps) => {
  let timeAgo = ''
  if (timestamp) {
    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    <time dateTime={timestamp} title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </time>
  )
}

export default TimeAgo