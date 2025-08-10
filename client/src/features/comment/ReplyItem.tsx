import { memo, useState } from "react";
import { User, ThumbsUp, MoreVertical } from "lucide-react";
import { Reply } from "../../types/comment";
import { formatDate } from "../../utils/utils";

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
  onDelete?: (replyId: string) => void;
  onEdit?: (replyId: string, newContent: string) => void;
}

export const ReplyItem = memo(
  ({ reply, onLike, onDelete, onEdit }: ReplyItemProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(reply.content);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isCurrentUser = reply.author === currentUser?.username;

    const handleEditSave = () => {
      if (onEdit) onEdit(reply.id, editText.trim());
      setIsEditing(false);
    };

    return (
      <div className="flex gap-3 relative">
        <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">
              {reply.author}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(reply.createdAt)}
            </span>

            {isCurrentUser && (
              <div className="ml-auto relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <MoreVertical className="w-3 h-3 text-gray-600" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-1 text-left text-xs hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(reply.id);
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-1 text-left text-xs text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div>
              <textarea
                className="w-full border rounded p-1 text-xs"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleEditSave}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
          )}

          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-xs ${
              reply.userLiked ? "text-blue-600" : "text-gray-500"
            } hover:text-blue-600`}
          >
            <ThumbsUp className="w-3 h-3" />
            {reply.likes.length}
          </button>
        </div>
      </div>
    );
  }
);

ReplyItem.displayName = "ReplyItem";
