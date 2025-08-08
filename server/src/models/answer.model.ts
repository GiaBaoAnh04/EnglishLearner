// answer.model.ts
import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IAnswer extends Document, IAudit {
  _id: ObjectId;
  content: string;
  questionId: ObjectId;
  authorId: ObjectId;
  votes: number;
  isBestAnswer: boolean;
}

export const AnswerSchema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AnswerSchema.add(AuditSchema);

AnswerSchema.index({ questionId: 1 });
AnswerSchema.index({ authorId: 1 });
AnswerSchema.index({ votes: -1 });
AnswerSchema.index({ isBestAnswer: 1 });

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
