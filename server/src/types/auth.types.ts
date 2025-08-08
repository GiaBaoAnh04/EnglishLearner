export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      email: string;
      username: string;
      fullName: string;
      avatar?: string;
      role: string;
      level: string;
      streak: number;
      totalPoints: number;
    };
    token: string;
  };
}
