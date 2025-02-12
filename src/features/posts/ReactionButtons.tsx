import { useAppDispatch } from "../../app/hooks"

import type { Post, ReactionName } from "./postsSlice"
import { useAddReactionMutation } from "../api/apiSlice"


const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  tada: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

type TReactionButtonsProps = {
  post: Post
}

const ReactionButtons = ({ post }: TReactionButtonsProps) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([stringName, emoji]) => {
      const reaction = stringName as ReactionName
      return (
        <button
          key={reaction}
          aria-label={`React with ${reaction}`}
          onClick={() => {
             addReaction({ postId: post.id, reaction })
          }}
        >
          {emoji} {post.reactions[reaction]}
        </button>
      )
    }
  )
  return (
    <div>{reactionButtons}</div>
  )
}

export default ReactionButtons