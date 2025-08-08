import { Comment } from "./comment";

export interface Idiom {
  id: number;
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology: string;
  category: string;
  difficulty: string;
  votes: number;
  downvotes: number;
  userVote: null | "up" | "down";
  comments: Comment[];
  createdAt: string;
  author: string;
  tags: string[];
}
