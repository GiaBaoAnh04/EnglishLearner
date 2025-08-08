import { memo } from "react";
import { User, ThumbsUp } from "lucide-react";
import { Reply } from "../../types/comment";
import { formatDate } from "../../utils/utils";

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
}

export const ReplyItem = memo(({ reply, onLike }: ReplyItemProps) => {
  return (
    <div className="flex gap-3">
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
        </div>
        <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-xs ${
            reply.userLiked ? "text-blue-600" : "text-gray-500"
          } hover:text-blue-600`}
        >
          <ThumbsUp className="w-3 h-3" />
          {reply.likes}
        </button>
      </div>
    </div>
  );
});

ReplyItem.displayName = "ReplyItem";
