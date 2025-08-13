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
