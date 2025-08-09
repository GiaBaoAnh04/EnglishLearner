// src/api/idiomApi.ts
import axiosClient from "./axiosClient";

export const idiomApi = {
  getAllIdioms: () => axiosClient.get("/idiom"),
  getAllCategories: () => axiosClient.get("/idiom/category"),

  voteIdiom: (idiomId: string, voteType: "up" | "down", token: string) => {
    return axiosClient.post(
      `/idiom/${idiomId}/vote`,
      { voteType },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};
