import { ObjectId, Schema, models, model } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IQuestion extends Document, IAudit {
  _id: ObjectId;
  title: string;
  content: string;
  tags: string[];
  authorId: ObjectId;
  votes: number;
  answersCount: number;
  isResolved: boolean;
  bestAnswerId?: ObjectId;
}

export const QuestionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    tags: [
      {
        type: String,
        maxlength: 20,
      },
    ],
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    answersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    bestAnswerId: {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  },
  {
    timestamps: true,
  }
);

QuestionSchema.add(AuditSchema);

QuestionSchema.index({ authorId: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ votes: -1 });
QuestionSchema.index({ isResolved: 1 });
QuestionSchema.index({ title: "text", content: "text" });

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
