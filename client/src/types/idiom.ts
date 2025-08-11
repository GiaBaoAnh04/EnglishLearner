import { Comment } from "./comment";

export interface Idiom {
  _id: string;
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology: string;
  category: string;
  difficulty: string;
  votes: any;
  downvotes: number;
  userVote: null | "up" | "down";
  comments: Comment[];
  createdAt: string;
  author: any;
  tags: string[];
}

export interface NewIdiomData {
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology: string;
  category: string;
  difficulty: string;
  tags: string[];
}
