import { memo } from "react";
import { Comment } from "../../types/comment";
import { CommentItem } from "./CommentItem";

interface CommentsListProps {
  comments: Comment[];
  onLikeComment: (commentId: string) => void;
  onReplySubmit: (commentId: string, replyText: string) => void;
  onLikeReply: (replyId: string, parentId: string) => void;
  onUpdated: (updated: Comment) => void;
  onDeleted: (commentId: string) => void;
  onEditReply: (replyId: string, newContent: string, parentId: string) => void; // thêm
  onDeleteReply: (replyId: string, parentId: string) => void; // thêm
}

export const CommentsList = memo(
  ({
    comments,
    onLikeComment,
    onReplySubmit,
    onLikeReply,
    onUpdated,
    onDeleted,
    onEditReply,
    onDeleteReply,
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
            onUpdated={onUpdated}
            onDeleted={onDeleted}
            onEditReply={onEditReply} // thêm
            onDeleteReply={onDeleteReply} // thêm
          />
        ))}
      </div>
    );
  }
);

CommentsList.displayName = "CommentsList";
