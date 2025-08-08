import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document, IAudit {
  _id: ObjectId;
  type: "vocabulary" | "grammar";
  title: string;
  description?: string;
  categoryId?: ObjectId;
  grammarId?: ObjectId;
  questions: IQuizQuestion[];
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit?: number; // minutes
  isActive: boolean;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question: {
    type: String,
    required: true,
    maxlength: 300,
  },
  options: [
    {
      type: String,
      required: true,
      maxlength: 100,
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    maxlength: 200,
  },
});

const QuizSchema = new Schema<IQuiz>(
  {
    type: {
      type: String,
      enum: ["vocabulary", "grammar"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    grammarId: {
      type: Schema.Types.ObjectId,
      ref: "Grammar",
    },
    questions: {
      type: [QuizQuestionSchema],
      validate: {
        validator: (questions: IQuizQuestion[]) => questions.length >= 5,
        message: "Quiz must have at least 5 questions",
      },
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    points: {
      type: Number,
      required: true,
      min: 1,
    },
    timeLimit: {
      type: Number,
      min: 1,
      max: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

QuizSchema.add(AuditSchema);

QuizSchema.index({ type: 1 });
QuizSchema.index({ categoryId: 1 });
QuizSchema.index({ grammarId: 1 });
QuizSchema.index({ difficulty: 1 });
QuizSchema.index({ isActive: 1 });

const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
