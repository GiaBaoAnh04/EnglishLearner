import { Schema, models, model, Document, ObjectId } from "mongoose";

export interface IUserVote extends Document {
  userId: ObjectId;
  targetId: ObjectId;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
  createdAt: Date;
}

export const UserVoteSchema = new Schema<IUserVote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserVoteSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true }
);
UserVoteSchema.index({ targetId: 1, targetType: 1 });

const UserVote =
  models.UserVote || model<IUserVote>("UserVote", UserVoteSchema);

export default UserVote;
