// import axios from "axios";
// import axiosClient from "./axiosClient";
// const API_BASE_URL = "http://localhost:5000/api";

// export interface CreateCommentRequest {
//   content: string;
//   idiomId: string;
// }

// export interface CreateCommentResponse {
//   _id: string;
//   content: string;
//   user: {
//     _id: string;
//     username: string;
//   };
//   idiom: string;
//   createdAt: string;
//   likes?: number;
// }

// export interface VoteCommentResponse {
//   likes: number;
//   userVote: "like" | null;
// }

// interface CommentApi {
//   voteComment: (
//     commentId: string,
//     voteType: "like" | "dislike",
//     token: string
//   ) => Promise<any>;
//   voteReply: (
//     replyId: string,
//     voteType: "like" | "dislike",
//     token: string
//   ) => Promise<any>;
// }

// export const voteCommentApi = async (
//   commentId: string,
//   voteType: "like" | "dislike",
//   token: string
// ) => {
//   const res = await axios.post(
//     `http://localhost:5000/api/comment/${commentId}/vote`,
//     { voteType },
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   return res.data;
// };

// export const createCommentApi = async (
//   data: CreateCommentRequest,
//   token: string
// ): Promise<CreateCommentResponse> => {
//   const response = await axios.post(`${API_BASE_URL}/comment`, data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

// export const commentApi: CommentApi = {
//   // Vote comment
//   voteComment: (
//     commentId: string,
//     voteType: "like" | "dislike",
//     token: string
//   ) =>
//     axiosClient.post(
//       `/comment/${commentId}/vote`,
//       { voteType },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     ),

//   // Vote reply
//   voteReply: (replyId: string, voteType: "like" | "dislike", token: string) =>
//     axiosClient.post(
//       `/reply/${replyId}/vote`,
//       { voteType },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     ),
// };

// export const updateComment = async (commentId: string, content: string) => {
//   const res = await axiosClient.put(`/comment/${commentId}`, { content });
//   return res.data;
// };

// export const deleteComment = async (commentId: string) => {
//   const res = await axiosClient.delete(`/comment/${commentId}`);
//   return res.data;
// };

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

// ✅ Thay axios cứng bằng axiosClient
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

// ✅ Thay axios cứng bằng axiosClient
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
