import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Clock,
  User,
  Star,
  Share2,
  Flag,
} from "lucide-react";
import { getDifficultyColor, formatDate } from "../../utils/utils";

interface IdiomDetailCardProps {
  idiom: {
    _id: string;
    title: string;
    meaning: string;
    example: string;
    explanation: string;
    etymology: string;
    category: string;
    difficulty: string;
    votes: number;
    downvotes: number;
    userVote: null | "up" | "down";
    comments: any[];
    createdAt: string;
    author: string;
    tags: string[];
  };
  isBookmarked: boolean;
  totalComments: number;
  onBookmarkToggle: () => void;
  onVote: (voteType: "up" | "down") => void;
}

export const IdiomDetailCard = ({
  idiom,
  isBookmarked,
  onBookmarkToggle,
  onVote,
  totalComments,
}: IdiomDetailCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            "{idiom.title}"
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                idiom.difficulty
              )}`}
            >
              {idiom.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
              {idiom.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBookmarkToggle}
            className={`p-2 rounded-lg border ${
              isBookmarked
                ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                : "bg-white border-gray-200 text-gray-600"
            } hover:bg-yellow-50`}
          >
            <Star className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Meaning */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Meaning</h3>
        <p className="text-gray-700 text-lg">{idiom.meaning}</p>
      </div>

      {/* Example */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Example</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-gray-700 italic">"{idiom.example}"</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Explanation
        </h3>
        <p className="text-gray-700 leading-relaxed">{idiom.explanation}</p>
      </div>

      {/* Etymology */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Etymology</h3>
        <p className="text-gray-700 leading-relaxed">{idiom.etymology}</p>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {idiom.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Vote and stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-gray-200 gap-4 sm:gap-0">
        {/* Phần vote và comment count */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 xs:gap-6 w-full sm:w-auto">
          {/* Vote buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVote("up")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                idiom.userVote === "up"
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-green-50"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="font-medium">{idiom.votes}</span>
            </button>
            <button
              onClick={() => onVote("down")}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                idiom.userVote === "down"
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-red-50"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="font-medium">{idiom.downvotes}</span>
            </button>
          </div>

          {/* Comment count */}
          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>{totalComments} comments</span>
          </div>
        </div>

        {/* Phần tác giả và ngày tạo */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 text-sm text-gray-500 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>by {idiom.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(idiom.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
