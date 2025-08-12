// import axios from "axios";
// const API_BASE_URL = "http://localhost:5000/api";

// export interface CreateReplyRequest {
//   content: string;
//   commentId: string;
// }

// export interface CreateReplyResponse {
//   _id: string;
//   content: string;
//   user: {
//     _id: string;
//     username: string;
//   };
//   comment: string;
//   createdAt: string;
//   likes?: number;
// }

// export const createReplyApi = async (
//   data: CreateReplyRequest,
//   token: string
// ): Promise<CreateReplyResponse> => {
//   const response = await axios.post(`${API_BASE_URL}/reply`, data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

// /* ----- API Edit Reply ----- */
// export const updateReplyApi = async (
//   replyId: string,
//   content: string,
//   token: string
// ): Promise<CreateReplyResponse> => {
//   const response = await axios.put(
//     `${API_BASE_URL}/reply/${replyId}`,
//     { content },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return response.data;
// };

// /* ----- API Delete Reply ----- */
// export const deleteReplyApi = async (
//   replyId: string,
//   token: string
// ): Promise<{ success: boolean; message: string }> => {
//   const response = await axios.delete(`${API_BASE_URL}/reply/${replyId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

import axiosClient from "./axiosClient";

export interface CreateReplyRequest {
  content: string;
  commentId: string;
}

export interface CreateReplyResponse {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
  };
  comment: string;
  createdAt: string;
  likes?: number;
}

export const createReplyApi = async (
  data: CreateReplyRequest,
  token: string
): Promise<CreateReplyResponse> => {
  const response = await axiosClient.post("/reply", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/* ----- API Edit Reply ----- */
export const updateReplyApi = async (
  replyId: string,
  content: string,
  token: string
): Promise<CreateReplyResponse> => {
  const response = await axiosClient.put(
    `/reply/${replyId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/* ----- API Delete Reply ----- */
export const deleteReplyApi = async (
  replyId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.delete(`/reply/${replyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
