import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IUser extends Document, IAudit {
  email: string;
  password: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string; // Thêm bio cho profile
  role: "student" | "admin";
  level: "beginner" | "intermediate" | "advanced";
  streak: number;
  totalPoints: number;
  lastLoginAt?: Date;
  isActive: boolean;
  emailVerified: boolean;
  favouriteIdioms: ObjectId[]; // Danh sách idiom yêu thích
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    fullName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: 500, // Giới hạn độ dài bio
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastLoginAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    favouriteIdioms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Idiom",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.add(AuditSchema);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
