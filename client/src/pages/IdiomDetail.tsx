import { useEffect, useState } from "react";
import { IdiomDetailCard } from "../features/idiom/IdiomDetailCard";
import { CommentForm } from "../features/comment/CommentForm";
import { CommentsList } from "../features/comment/CommentList";
import { Comment, Reply } from "../types/comment";
import { Idiom } from "../types/idiom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { commentApi, createCommentApi } from "../api/commentApi";
import { createReplyApi } from "../api/replyApi";
import { idiomApi } from "../api/idiomApi";

const IdiomDetail = () => {
  const { id } = useParams();
  const [idiom, setIdiom] = useState<Idiom | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleVote = async (voteType: "up" | "down") => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login to vote");
      return;
    }
    if (!idiom?._id) return;

    // Optimistic update
    setIdiom((prev) => {
      if (!prev) return prev;
      const newIdiom = { ...prev };

      if (prev.userVote === voteType) {
        newIdiom.userVote = null;
        if (voteType === "up") newIdiom.votes -= 1;
        else newIdiom.downvotes -= 1;
      } else {
        if (prev.userVote === "up" && voteType === "down") {
          newIdiom.votes -= 1;
          newIdiom.downvotes += 1;
        } else if (prev.userVote === "down" && voteType === "up") {
          newIdiom.downvotes -= 1;
          newIdiom.votes += 1;
        } else if (prev.userVote === null) {
          if (voteType === "up") newIdiom.votes += 1;
          else newIdiom.downvotes += 1;
        }
        newIdiom.userVote = voteType;
      }
      return newIdiom;
    });

    try {
      const res = await idiomApi.voteIdiom(idiom._id, voteType, token);
      const data = res.data.data; // Controller trả về { success, message, data: {...} }

      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          votes: data.upvotes,
          downvotes: data.downvotes,
          userVote: data.userVote,
        };
      });
    } catch (error) {
      console.error("Error voting idiom:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleReply = async (commentId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login to reply");
      return;
    }

    if (!idiom?._id) {
      console.error("No idiom ID found");
      return;
    }

    if (isSubmittingReply) return; // tránh submit nhiều lần
    setIsSubmittingReply(true);

    // Tạo reply tạm thời để optimistic update
    const tempReply: Reply = {
      id: Date.now().toString(), // ID tạm thời
      author: "You",
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      userLiked: false,
    };

    // Optimistic update: thêm reply vào comment tương ứng
    setIdiom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, tempReply] }
            : comment
        ),
      };
    });

    try {
      // Gọi API createReply
      const response = await createReplyApi(
        {
          content: replyText.trim(),
          commentId,
        },
        token
      );

      // Cập nhật lại với dữ liệu thực từ server
      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies.filter((r) => r.id !== tempReply.id),
                    {
                      id: response._id,
                      author: response.user?.username || "You",
                      content: response.content,
                      createdAt: response.createdAt,
                      likes: response.likes || 0,
                      userLiked: false,
                    },
                  ],
                }
              : comment
          ),
        };
      });
    } catch (error) {
      console.error("Error creating reply:", error);

      // Xóa reply tạm thời khi lỗi
      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((r) => r.id !== tempReply.id),
                }
              : comment
          ),
        };
      });

      alert("Failed to post reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleComment = async (commentText: string) => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login to comment");
      return;
    }

    if (!idiom?._id) {
      console.error("No idiom ID found");
      return;
    }

    if (isSubmittingComment) return; // Prevent multiple submissions

    setIsSubmittingComment(true);

    // Create temporary comment for optimistic update
    const tempComment: Comment = {
      id: Date.now().toString(), // Temporary ID
      author: "You", // Will be updated with actual user data
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      userLiked: false,
      replies: [],
    };

    // Optimistic update
    setIdiom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: [tempComment, ...prev.comments],
      };
    });

    try {
      // Call API to create comment
      const response = await createCommentApi(
        {
          content: commentText.trim(),
          idiomId: idiom._id,
        },
        token
      );

      // Update with actual comment data from server
      setIdiom((prev) => {
        if (!prev) return prev;

        const actualComment: Comment = {
          id: response._id,
          author: response.user?.username || "You",
          content: response.content,
          createdAt: response.createdAt,
          likes: response.likes || 0,
          userLiked: false,
          replies: [],
        };

        return {
          ...prev,
          comments: [
            actualComment,
            ...prev.comments.filter((c) => c.id !== tempComment.id), // Remove temp comment
          ],
        };
      });
    } catch (error) {
      console.error("Error creating comment:", error);

      // Remove optimistic comment on error
      setIdiom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter((c) => c.id !== tempComment.id),
        };
      });

      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like");
      return;
    }

    if (isReply && !parentId) {
      console.error("Parent ID is required for reply vote");
      return;
    }

    // Optimistic update UI trước
    setIdiom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map((c) => {
          if (!isReply) {
            if (c.id === commentId) {
              const liked = c.userLiked;
              const newLikesCount = liked
                ? c.likes.length - 1
                : c.likes.length + 1;
              return {
                ...c,
                userLiked: !liked,
                likes: Array(newLikesCount).fill(""),
              };
            }
            return c;
          } else {
            if (c.id === parentId) {
              return {
                ...c,
                replies: c.replies.map((r) => {
                  if (r.id === commentId) {
                    const liked = r.userLiked;
                    const newLikesCount = liked
                      ? r.likes.length - 1
                      : r.likes.length + 1;
                    return {
                      ...r,
                      userLiked: !liked,
                      likes: Array(newLikesCount).fill(""),
                    };
                  }
                  return r;
                }),
              };
            }
            return c;
          }
        }),
      };
    });

    try {
      if (!isReply) {
        const res = await commentApi.voteComment(commentId, "like", token);
        const { likes, userVote } = res.data;

        setIdiom((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    likes: Array(likes).fill(""),
                    userLiked: userVote === "like",
                  }
                : c
            ),
          };
        });
      } else {
        const res = await commentApi.voteReply(commentId, "like", token);
        const { likes, userVote } = res.data.data;

        setIdiom((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: c.replies.map((r) =>
                      r.id === commentId
                        ? {
                            ...r,
                            likes: Array(likes).fill(""),
                            userLiked: userVote === "like",
                          }
                        : r
                    ),
                  }
                : c
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error liking:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/idiom/${id}`).then((res) => {
      const data = res.data as any;
      const sortedComments = (data.comments || []).sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const comments: Comment[] = (sortedComments || []).map((c: any) => ({
        id: c._id,
        author: c.user?.username || "Unknown",
        content: c.content,
        createdAt: c.createdAt,
        likes: c.likes || [],
        userLiked: false,
        replies: (c.replies || []).map((r: any) => ({
          id: r._id,
          author: r.user?.username || "Unknown",
          content: r.content,
          createdAt: r.createdAt,
          likes: r.likes || [],
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
        author: {
          id: data.author?._id || "",
          username: data.author?.username || "Unknown",
        },
        comments,
        createdAt: data.createdAt || new Date().toISOString(),
        tags: data.tags || [],
      };

      setIdiom(mappedIdiom);
    });
  }, [id]);

  if (!idiom)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading idiom...</p>
        </div>
      </div>
    );

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
              onUpdated={(updatedComment) => {
                setIdiom((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    comments: prev.comments.map((c) =>
                      c.id === updatedComment.id ? updatedComment : c
                    ),
                  };
                });
              }}
              onDeleted={(deletedId) => {
                setIdiom((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    comments: prev.comments.filter((c) => c.id !== deletedId),
                  };
                });
              }}
              onEditReply={(replyId, newContent, parentId) => {
                setIdiom((prev) => ({
                  ...prev!,
                  comments: prev!.comments.map((c) =>
                    c.id === parentId
                      ? {
                          ...c,
                          replies: c.replies.map((r) =>
                            r.id === replyId ? { ...r, content: newContent } : r
                          ),
                        }
                      : c
                  ),
                }));
              }}
              onDeleteReply={(replyId, parentId) => {
                setIdiom((prev) => ({
                  ...prev!,
                  comments: prev!.comments.map((c) =>
                    c.id === parentId
                      ? {
                          ...c,
                          replies: c.replies.filter((r) => r.id !== replyId),
                        }
                      : c
                  ),
                }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomDetail;
