import { Schema, models, model, Document, ObjectId } from "mongoose";

export interface IQuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface IQuizResult extends Document {
  _id: ObjectId;
  userId: ObjectId;
  quizId: ObjectId;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number; // seconds
  answers: IQuizAnswer[];
  completedAt: Date;
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  questionIndex: {
    type: Number,
    required: true,
    min: 0,
  },
  selectedAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const QuizResultSchema = new Schema<IQuizResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0,
  },
  timeSpent: {
    type: Number,
    min: 0,
  },
  answers: [QuizAnswerSchema],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

QuizResultSchema.index({ userId: 1 });
QuizResultSchema.index({ quizId: 1 });
QuizResultSchema.index({ completedAt: -1 });
QuizResultSchema.index({ userId: 1, completedAt: -1 });

const QuizResult =
  models.QuizResult || model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
