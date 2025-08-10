import { memo } from "react";
import { Comment } from "../../types/comment";
import { CommentItem } from "./CommentItem";

interface CommentsListProps {
  comments: Comment[];
  onLikeComment: (commentId: string) => void;
  onReplySubmit: (commentId: string, replyText: string) => void;
  onLikeReply: (replyId: string, parentId: string) => void;
}

export const CommentsList = memo(
  ({
    comments,
    onLikeComment,
    onReplySubmit,
    onLikeReply,
  }: CommentsListProps) => {
    return (
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={`comment-${comment.id}-${comment.createdAt}`}
            comment={comment}
            onLike={onLikeComment}
            onReplySubmit={onReplySubmit}
            onLikeReply={onLikeReply}
          />
        ))}
      </div>
    );
  }
);

CommentsList.displayName = "CommentsList";
