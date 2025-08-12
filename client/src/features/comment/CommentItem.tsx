import { memo, useState } from "react";
import { User, ThumbsUp, MoreVertical } from "lucide-react";
import { ReplyItem } from "./ReplyItem";
import { Comment } from "../../types/comment";
import { formatDate } from "../../utils/utils";
import { CommentForm } from "./CommentForm";
import { updateComment, deleteComment } from "../../api/commentApi";
import { updateReplyApi, deleteReplyApi } from "../../api/replyApi";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReplySubmit: (commentId: string, replyText: string) => void;
  onLikeReply: (replyId: string, parentId: string) => void;
  onUpdated: (updated: Comment) => void;
  onDeleted: (commentId: string) => void;
  onEditReply: (replyId: string, newContent: string, parentId: string) => void;
  onDeleteReply: (replyId: string, parentId: string) => void;
}

export const CommentItem = memo(
  ({
    comment,
    onLike,
    onReplySubmit,
    onLikeReply,
    onUpdated,
    onDeleted,
    onEditReply,
    onDeleteReply,
  }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const token = localStorage.getItem("token") || "";
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isCurrentUser = comment.author === currentUser?.username;

    const handleEditSave = async () => {
      try {
        await updateComment(comment.id, editText);
        onUpdated({ ...comment, content: editText }); // update ngay UI
        setIsEditing(false);
      } catch (err) {
        console.error("Update failed:", err);
      }
    };

    const handleDelete = async () => {
      try {
        await deleteComment(comment.id);
        onDeleted(comment.id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    };

    const handleEditReply = async (
      replyId: string,
      newContent: string,
      parentId: string
    ) => {
      try {
        const updatedReply = await updateReplyApi(replyId, newContent, token);
        onEditReply(replyId, updatedReply.content, parentId);
      } catch (err) {
        console.error("Update reply failed:", err);
      }
    };

    // Xử lý delete reply
    const handleDeleteReply = async (replyId: string, parentId: string) => {
      try {
        await deleteReplyApi(replyId, token);
        onDeleteReply(replyId, parentId);
      } catch (err) {
        console.error("Delete reply failed:", err);
      }
    };

    return (
      <div className="border-b border-gray-100 pb-6 last:border-b-0 relative">
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

              {isCurrentUser && (
                <div className="ml-auto relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full px-3 py-1 text-left text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setMenuOpen(false);
                        }}
                        className="block w-full px-3 py-1 text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mb-3">
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleEditSave}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-3">{comment.content}</p>
            )}

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

            <div className="mt-4 pl-10  space-y-4">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onLike={() => onLikeReply(reply.id, comment.id)}
                  onDelete={(replyId) => handleDeleteReply(replyId, comment.id)}
                  onEdit={(replyId, newContent) =>
                    handleEditReply(replyId, newContent, comment.id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";
