export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: any;
  userLiked: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: any;
  userLiked: boolean;
  replies: Reply[];
}
