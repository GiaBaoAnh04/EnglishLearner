import { Schema, model, models, ObjectId, Document } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IVote {
  user: ObjectId;
  voteType: "up" | "down";
}

export interface IIdiom extends Document {
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology: string;
  category: string;
  difficulty: string;
  votes: IVote[];
  comments: ObjectId[];
  createdAt: Date;
  author: ObjectId;
  tags: string[];
}

const IdiomSchema = new Schema<IIdiom>(
  {
    title: { type: String, required: true },
    meaning: { type: String, required: true },
    example: { type: String, required: true },
    explanation: { type: String, required: true },
    etymology: { type: String },
    category: { type: String },
    difficulty: { type: String },
    votes: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        voteType: { type: String, enum: ["up", "down"], required: true },
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Idiom = models.Idiom || model<IIdiom>("Idiom", IdiomSchema);
export default Idiom;
