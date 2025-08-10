import { User, Send } from "lucide-react";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  currentUserAvatar?: React.ReactNode;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
  initialValue?: string;
}

export const CommentForm = ({
  onSubmit,
  onKeyDown,
  currentUserAvatar = (
    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
      <User className="w-4 h-4 text-white" />
    </div>
  ),
  placeholder = "Share your thoughts...",
  buttonText = "Comment",
  onCancel,
  initialValue = "",
}: CommentFormProps) => {
  const [comment, setComment] = useState(initialValue);

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (onKeyDown) onKeyDown(e);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-4">
        {currentUserAvatar}
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end mt-2 gap-2">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
