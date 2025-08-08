export interface Reply {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked: boolean;
  replies: Reply[];
}
