import axios from "axios";

export const voteCommentApi = async (
  commentId: string,
  voteType: "like" | "dislike",
  token: string
) => {
  const res = await axios.post(
    `http://localhost:5000/api/comment/${commentId}/vote`,
    { voteType },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
