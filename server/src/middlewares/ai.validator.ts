import Joi from "joi";

export const generateSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Idiom title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
});

export const validateGenerateRequest = (data: any) => {
  return generateSchema.validate(data, { abortEarly: false });
};
