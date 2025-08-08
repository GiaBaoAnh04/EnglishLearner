import { Schema, models, model, Document, ObjectId } from "mongoose";
import { IAudit, AuditSchema } from "./audit.model";

export interface ICategory extends Document, IAudit {
  _id: ObjectId;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    icon: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.add(AuditSchema);

CategorySchema.index({ name: 1 }, { unique: true });
CategorySchema.index({ isActive: 1 });

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
