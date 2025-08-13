import axiosClient from "./axiosClient";

export interface CreateCommentRequest {
  content: string;
  idiomId: string;
}

export interface CreateCommentResponse {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
  };
  idiom: string;
  createdAt: string;
  likes?: number;
}

export interface VoteCommentResponse {
  likes: number;
  userVote: "like" | null;
}

interface CommentApi {
  voteComment: (
    commentId: string,
    voteType: "like" | "dislike",
    token: string
  ) => Promise<any>;
  voteReply: (
    replyId: string,
    voteType: "like" | "dislike",
    token: string
  ) => Promise<any>;
}

export const voteCommentApi = async (
  commentId: string,
  voteType: "like" | "dislike",
  token: string
) => {
  const res = await axiosClient.post(
    `/comment/${commentId}/vote`,
    { voteType },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createCommentApi = async (
  data: CreateCommentRequest,
  token: string
): Promise<CreateCommentResponse> => {
  const response = await axiosClient.post(`/comment`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const commentApi: CommentApi = {
  // Vote comment
  voteComment: (
    commentId: string,
    voteType: "like" | "dislike",
    token: string
  ) =>
    axiosClient.post(
      `/comment/${commentId}/vote`,
      { voteType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  // Vote reply
  voteReply: (replyId: string, voteType: "like" | "dislike", token: string) =>
    axiosClient.post(
      `/reply/${replyId}/vote`,
      { voteType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export const updateComment = async (commentId: string, content: string) => {
  const res = await axiosClient.put(`/comment/${commentId}`, { content });
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await axiosClient.delete(`/comment/${commentId}`);
  return res.data;
};
