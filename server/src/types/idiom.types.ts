import { Document, Types } from "mongoose";
import { IUser } from "../models/user.model";

export interface IVote {
  user: Types.ObjectId | IUser;
  value: number; // e.g., 1 for upvote, -1 for downvote
}

export interface IComment {
  user: Types.ObjectId | IUser;
  content: string;
  createdAt: Date;
}

export interface IIdiom extends Document {
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology?: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  author: Types.ObjectId | IUser;
  votes: IVote[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
