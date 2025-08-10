// src/api/idiomApi.ts
import axiosClient from "./axiosClient";

export const idiomApi = {
  getAllIdioms: () => axiosClient.get("/idiom"),
  getAllCategories: () => axiosClient.get("/idiom/category"),

  voteIdiom: (idiomId: string, voteType: "up" | "down", token: string) =>
    axiosClient.post(
      `/idiom/${idiomId}/vote`,
      { voteType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  updateIdiom: (idiomId: string, data: any, token: string) =>
    axiosClient.put(`/idiom/${idiomId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  deleteIdiom: (idiomId: string, token: string) =>
    axiosClient.delete(`/idiom/${idiomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
