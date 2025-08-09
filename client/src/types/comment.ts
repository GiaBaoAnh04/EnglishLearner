export interface Reply {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: any;
  userLiked: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: any;
  userLiked: boolean;
  replies: Reply[];
}
