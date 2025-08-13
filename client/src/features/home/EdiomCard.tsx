import { Clock, MessageCircle, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDifficultyColor, formatDate } from "../../utils/utils";
import { Idiom } from "../../types/idiom";

interface IdiomCardProps {
  idiom: Idiom;
  className?: string;
  onClick?: (id: string) => void;
}

export const IdiomCard = ({
  idiom,
  className = "",
  onClick,
}: IdiomCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    onClick ? onClick(idiom._id) : navigate(`/idiom-detail/${idiom._id}`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 flex flex-col ${className}`}
      style={{ minHeight: "380px", height: "100%" }}
      onClick={handleClick}
    >
      {/* Phần nội dung card giữ nguyên như trước */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              "{idiom.title}"
            </h3>
            <p className="text-gray-600 mb-2 line-clamp-2">{idiom.meaning}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              idiom.difficulty
            )}`}
          >
            {idiom.difficulty}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-1">
          <p className="text-sm text-gray-700 italic line-clamp-3">
            "{idiom.example}"
          </p>
        </div>

        <div className="text-sm text-gray-600 mb-4 line-clamp-3">
          {idiom.explanation.substring(0, 100)}...
        </div>

        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{idiom.votes.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{idiom.comments.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(idiom.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              by {idiom.author?.fullName}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {idiom.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
