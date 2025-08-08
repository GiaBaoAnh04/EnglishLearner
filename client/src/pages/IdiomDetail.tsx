import { useState } from "react";
import { mockIdiom } from "../dummy/dummyIdioms";
import { IdiomDetailCard } from "../features/idiom/IdiomDetailCard";
import { CommentForm } from "../features/comment/CommentForm";
import { CommentsList } from "../features/comment/CommentList";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
  replies: Reply[];
}

interface Idiom {
  id: number;
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
  comments: Comment[];
  createdAt: string;
  author: string;
  tags: string[];
}

interface Reply {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
}

const IdiomDetail = () => {
  const [idiom, setIdiom] = useState<Idiom>(mockIdiom);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleVote = (voteType: "up" | "down") => {
    setIdiom((prev) => {
      const newIdiom = { ...prev };

      if (prev.userVote === voteType) {
        // Remove vote
        newIdiom.userVote = null;
        if (voteType === "up") {
          newIdiom.votes -= 1;
        } else {
          newIdiom.downvotes -= 1;
        }
      } else {
        // Change or add vote
        if (prev.userVote === "up" && voteType === "down") {
          newIdiom.votes -= 1;
          newIdiom.downvotes += 1;
        } else if (prev.userVote === "down" && voteType === "up") {
          newIdiom.downvotes -= 1;
          newIdiom.votes += 1;
        } else if (prev.userVote === null) {
          if (voteType === "up") {
            newIdiom.votes += 1;
          } else {
            newIdiom.downvotes += 1;
          }
        }
        newIdiom.userVote = voteType;
      }

      return newIdiom;
    });
  };

  const handleReply = (commentId: number, replyText: string) => {
    if (replyText.trim()) {
      const reply: Reply = {
        id: Date.now(),
        author: "CurrentUser",
        content: replyText,
        createdAt: new Date().toISOString(),
        likes: 0,
        userLiked: false,
      };

      setIdiom((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        ),
      }));
    }
  };

  const handleComment = (commentText: string) => {
    if (commentText.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: "CurrentUser",
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        userLiked: false,
        replies: [],
      };

      setIdiom((prev) => ({
        ...prev,
        comments: [comment, ...prev.comments],
      }));
    }
  };

  const handleLikeComment = (
    commentId: number,
    isReply: boolean = false,
    parentId: number | null = null
  ) => {
    setIdiom((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) => {
        if (isReply && parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    likes: reply.userLiked ? reply.likes - 1 : reply.likes + 1,
                    userLiked: !reply.userLiked,
                  }
                : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
          return {
            ...comment,
            likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
            userLiked: !comment.userLiked,
          };
        }
        return comment;
      }),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main idiom card */}
          <IdiomDetailCard
            idiom={idiom}
            isBookmarked={isBookmarked}
            onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
            onVote={handleVote}
          />

          {/* Comments section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Comments ({idiom.comments.length})
            </h2>

            {/* Add comment */}
            <CommentForm
              onSubmit={handleComment}
              placeholder="Share your thoughts about this idiom..."
            />

            {/* Comments list */}

            <CommentsList
              comments={idiom.comments}
              onLikeComment={handleLikeComment}
              onReplySubmit={handleReply} // Truyền thẳng hàm handleReply
              onLikeReply={(replyId, parentId) =>
                handleLikeComment(replyId, true, parentId)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomDetail;
