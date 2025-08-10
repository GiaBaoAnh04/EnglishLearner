import { memo, useState } from "react";
import { User, ThumbsUp } from "lucide-react";
import { ReplyItem } from "./ReplyItem";
import { Comment } from "../../types/comment";
import { formatDate } from "../../utils/utils";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReplySubmit: (commentId: string, replyText: string) => void;
  onLikeReply: (replyId: string, parentId: string) => void;
}

export const CommentItem = memo(
  ({ comment, onLike, onReplySubmit, onLikeReply }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);

    return (
      <div className="border-b border-gray-100 pb-6 last:border-b-0">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-800">
                {comment.author}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 text-sm ${
                  comment.userLiked ? "text-blue-600" : "text-gray-500"
                } hover:text-blue-600`}
              >
                <ThumbsUp className="w-3 h-3" />
                {comment.likes.length}
              </button>
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reply
              </button>
            </div>

            {isReplying && (
              <div className="mt-4 pl-10">
                <CommentForm
                  onSubmit={(replyText) => {
                    onReplySubmit(comment.id, replyText);
                    setIsReplying(false);
                  }}
                  onCancel={() => setIsReplying(false)}
                  placeholder="Write a reply..."
                  buttonText="Reply"
                />
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-100">
                {comment.replies.map((reply) => (
                  <ReplyItem
                    key={`reply-${reply.id}-${reply.createdAt}`}
                    reply={reply}
                    onLike={() => onLikeReply(reply.id, comment.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";
