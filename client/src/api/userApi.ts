import axiosClient from "./axiosClient";

export const userApi = {
  // Lấy thông tin profile
  getProfile: (token: string) =>
    axiosClient.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Cập nhật thông tin profile
  updateProfile: (data: any, token: string) =>
    axiosClient.put("/user/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Upload avatar
  uploadAvatar: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return axiosClient.post("/user/profile/avatar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Lấy thống kê user
  getUsertats: (token: string) =>
    axiosClient.get("/user/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Lấy danh sách favourite idioms
  getFavouriteIdioms: (token: string) =>
    axiosClient.get("/user/favourites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Thêm vào favourites
  addToFavourites: (idiomId: string, token: string) =>
    axiosClient.post(
      `/user/favourites/${idiomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  // Xoá khỏi favourites
  removeFromFavourites: (idiomId: string, token: string) =>
    axiosClient.delete(`/user/favourites/${idiomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
