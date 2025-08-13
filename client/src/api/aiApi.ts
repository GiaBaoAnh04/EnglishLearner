import axiosClient from "./axiosClient";

export const aiApi = {
  generateIdiomData: async (title: string) => {
    const res = await axiosClient.post("/ai/generate-idiom", {
      title,
    });

    return res.data.data;
  },
};
