import { Schema, model, Types, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  user: Types.ObjectId;
  idiom: Types.ObjectId;
  replies: Types.ObjectId[];
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    idiom: { type: Schema.Types.ObjectId, ref: "Idiom", required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", CommentSchema);
