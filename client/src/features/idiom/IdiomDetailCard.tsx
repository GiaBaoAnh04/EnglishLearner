import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { idiomApi } from "../../api/idiomApi";
import { EditIdiomModal } from "./EditIdiomModal"; // Import modal component
import {
  Star,
  Edit,
  Trash,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
  Clock,
} from "lucide-react";
import { formatDate, getDifficultyColor } from "../../utils/utils";
import { Idiom } from "../../types/idiom";
import { userApi } from "../../api/userApi";

interface IdiomDetailCardProps {
  idiom: Idiom;
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
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();
  const [currentIdiom, setCurrentIdiom] = useState(idiom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isAuthor = currentUser?._id === currentIdiom.author?.id;

  let upVotes = 0;
  let downVotes = 0;
  let userVote: "up" | "down" | null = null;

  if (Array.isArray(currentIdiom.votes)) {
    upVotes = currentIdiom.votes.filter(
      (vote: any) => vote.voteType === "up"
    ).length;
    downVotes = currentIdiom.votes.filter(
      (vote: any) => vote.voteType === "down"
    ).length;
    userVote =
      currentIdiom.votes.find((vote: any) => vote.user === currentUser?._id)
        ?.voteType || null;
  } else {
    upVotes = currentIdiom.votes || 0;
    downVotes = currentIdiom.downvotes || 0;
    userVote = currentIdiom.userVote || null;
  }

  const handleDelete = async () => {
    if (!window.confirm("Xóa idiom này?")) return;
    try {
      await idiomApi.deleteIdiom(currentIdiom._id, token!);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveIdiom = async (updatedData: any) => {
    try {
      await idiomApi.updateIdiom(currentIdiom._id, updatedData, token!);
      setCurrentIdiom((prev) => (prev ? { ...prev, ...updatedData } : prev));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              "{currentIdiom.title}"
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                  currentIdiom.difficulty
                )}`}
              >
                {currentIdiom.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
                {currentIdiom.category}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  if (isBookmarked) {
                    await userApi.removeFromFavourites(
                      currentIdiom._id,
                      token!
                    );
                  } else {
                    await userApi.addToFavourites(currentIdiom._id, token!);
                  }
                  onBookmarkToggle();
                } catch (error) {
                  console.error("Bookmark error:", error);
                }
              }}
              className={`p-2 rounded-lg border ${
                isBookmarked
                  ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                  : "bg-white border-gray-200 text-gray-600"
              } hover:bg-yellow-50`}
            >
              <Star
                className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Edit className="w-5 h-5" />
                </button>

                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Meaning */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Meaning</h3>
          <p className="text-gray-700 text-lg">
            {String(currentIdiom.meaning || "")}
          </p>
        </div>

        {/* Example */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Example</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-gray-700 italic">
              "{String(currentIdiom.example || "")}"
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Explanation
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {String(currentIdiom.explanation || "")}
          </p>
        </div>

        {/* Etymology */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Etymology
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {String(currentIdiom.etymology || "")}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {currentIdiom.tags &&
              Array.isArray(currentIdiom.tags) &&
              currentIdiom.tags.map((tag: string, index: number) => (
                <span
                  key={`tag-${index}`}
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
                  userVote === "up"
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
                  userVote === "down"
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
              <span>{Number(totalComments) || 0} comments</span>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 text-sm text-gray-500 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                by {String(currentIdiom.author?.username || "Unknown")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(currentIdiom.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <EditIdiomModal
        idiom={currentIdiom}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveIdiom}
      />
    </>
  );
};
