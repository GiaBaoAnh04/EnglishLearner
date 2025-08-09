import { useEffect, useState } from "react";
import { IdiomDetailCard } from "../features/idiom/IdiomDetailCard";
import { CommentForm } from "../features/comment/CommentForm";
import { CommentsList } from "../features/comment/CommentList";
import { Comment, Reply } from "../types/comment";
import { Idiom } from "../types/idiom";
import axios from "axios";
import { useParams } from "react-router-dom";

const IdiomDetail = () => {
  const [idiom, setIdiom] = useState<Idiom | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = useParams();

  const handleVote = (voteType: "up" | "down") => {
    setIdiom((prev) => {
      if (!prev) return prev; // nếu null thì giữ nguyên

      const newIdiom: Idiom = { ...prev };

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

      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, reply] }
              : comment
          ),
        };
      });
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

      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [comment, ...prev.comments],
        };
      });
    }
  };

  const handleLikeComment = (
    commentId: number,
    isReply: boolean = false,
    parentId: number | null = null
  ) => {
    setIdiom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map((comment) => {
          if (isReply && parentId && comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      likes: reply.userLiked
                        ? reply.likes - 1
                        : reply.likes + 1,
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
      };
    });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/idiom/${id}`).then((res) => {
      const data = res.data as any;

      const comments: Comment[] = (data.comments || []).map((c: any) => ({
        id: c._id,
        author: c.user?.username || "Unknown",
        content: c.content,
        createdAt: c.createdAt,
        likes: c.likes || 0,
        userLiked: false,
        replies: (c.replies || []).map((r: any) => ({
          id: r._id,
          author: r.user?.username || "Unknown",
          content: r.content,
          createdAt: r.createdAt,
          likes: r.likes || 0,
          userLiked: false,
        })),
      }));

      const upvotes = (data.votes || []).filter(
        (v: any) => v.voteType === "up"
      ).length;
      const downvotes = (data.votes || []).filter(
        (v: any) => v.voteType === "down"
      ).length;

      const mappedIdiom: Idiom = {
        _id: data._id || "",
        title: data.title || "",
        meaning: data.meaning || "",
        example: data.example || "",
        explanation: data.explanation || "",
        etymology: data.etymology || "",
        category: data.category || "",
        difficulty: data.difficulty || "",
        votes: upvotes,
        downvotes: downvotes,
        userVote: null,
        author: data.author?.username || "Unknown",
        comments,
        createdAt: data.createdAt || new Date().toISOString(),
        tags: data.tags || [],
      };

      setIdiom(mappedIdiom);
    });
  }, [id]);

  if (!idiom) return <div>Loading...</div>;

  const totalComments =
    idiom.comments.length +
    idiom.comments.reduce((sum, comment) => sum + comment.replies.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <IdiomDetailCard
            idiom={idiom}
            isBookmarked={isBookmarked}
            totalComments={totalComments}
            onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
            onVote={handleVote}
          />

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Comments ({totalComments})
            </h2>

            <CommentForm
              onSubmit={handleComment}
              placeholder="Share your thoughts about this idiom..."
            />

            <CommentsList
              comments={idiom.comments}
              onLikeComment={handleLikeComment}
              onReplySubmit={handleReply}
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
