import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IVocabulary extends Document, IAudit {
  _id: ObjectId;
  word: string;
  pronunciation?: string;
  meaning: string;
  example: string;
  categoryId: ObjectId;
  difficulty: "easy" | "medium" | "hard";
  audio?: string;
  image?: string;
  isApproved: boolean;
}

const VocabularySchema = new Schema<IVocabulary>(
  {
    word: {
      type: String,
      required: true,
      maxlength: 50,
      lowercase: true,
    },
    pronunciation: String,
    meaning: {
      type: String,
      required: true,
      maxlength: 200,
    },
    example: {
      type: String,
      required: true,
      maxlength: 300,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    audio: String,
    image: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

VocabularySchema.add(AuditSchema);

VocabularySchema.index({ word: 1, categoryId: 1 }, { unique: true });
VocabularySchema.index({ categoryId: 1 });
VocabularySchema.index({ difficulty: 1 });
VocabularySchema.index({ isApproved: 1 });
VocabularySchema.index({ word: "text" });

const Vocabulary =
  models.Vocabulary || model<IVocabulary>("Vocabulary", VocabularySchema);

export default Vocabulary;
