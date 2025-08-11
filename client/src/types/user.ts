// src/types/user.ts
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  createdAt: string;
  totalIdioms: number;
  totalLikes: number;
  level: string;
}

export interface EditProfileData {
  username: string;
  bio: string;
  avatar: string;
}
