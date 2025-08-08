import { Schema, models, model, Document, ObjectId } from "mongoose";

export interface IUserProgress extends Document {
  _id: ObjectId;
  userId: ObjectId;
  vocabularyId: ObjectId;
  status: "learning" | "mastered" | "review";
  reviewCount: number;
  lastReviewAt?: Date;
  nextReviewAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vocabularyId: {
      type: Schema.Types.ObjectId,
      ref: "Vocabulary",
      required: true,
    },
    status: {
      type: String,
      enum: ["learning", "mastered", "review"],
      default: "learning",
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastReviewAt: Date,
    nextReviewAt: Date,
  },
  {
    timestamps: true,
  }
);

UserProgressSchema.index({ userId: 1, vocabularyId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, status: 1 });
UserProgressSchema.index({ nextReviewAt: 1 });

const UserProgress =
  models.UserProgress ||
  model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgress;
