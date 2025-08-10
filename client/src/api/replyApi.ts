import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

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
  const response = await axios.post(`${API_BASE_URL}/reply`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
