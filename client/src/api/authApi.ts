import axiosClient from "./axiosClient";

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) => {
    return axiosClient.post("/auth/register", data);
  },

  login: (data: LoginData) => {
    return axiosClient.post("/auth/login", data);
  },
};
