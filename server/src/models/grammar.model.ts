import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface IGrammar extends Document, IAudit {
  _id: ObjectId;
  title: string;
  description: string;
  examples: string[];
  difficulty: "easy" | "medium" | "hard";
  isActive: boolean;
}

const GrammarSchema = new Schema<IGrammar>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    examples: [
      {
        type: String,
        maxlength: 200,
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
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

GrammarSchema.add(AuditSchema);

GrammarSchema.index({ title: 1 });
GrammarSchema.index({ difficulty: 1 });
GrammarSchema.index({ isActive: 1 });

const Grammar = models.Grammar || model<IGrammar>("Grammar", GrammarSchema);

export default Grammar;
