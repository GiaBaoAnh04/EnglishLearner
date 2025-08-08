import { Schema, model, Types, Document } from "mongoose";

export interface IReply extends Document {
  content: string;
  user: Types.ObjectId;
  comment: Types.ObjectId;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Reply = model<IReply>("Reply", ReplySchema);
