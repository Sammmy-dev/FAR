import mongoose, { Schema, models, model } from "mongoose";

export interface IAssessmentQuestion {
  type: "MCQ" | "OPEN_ENDED";
  prompt: string;
  options?: [string, string, string, string];
  correctIndex?: number;
  expectedAnswer?: string;
}

export interface IAssessmentDocument extends mongoose.Document {
  title: string;
  description?: string;
  durationMinutes: number;
  isActive: boolean;
  questions: IAssessmentQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    type: {
      type: String,
      enum: ["MCQ", "OPEN_ENDED"],
      required: true,
      default: "MCQ",
    },
    prompt: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: false,
      validate: {
        validator(this: IAssessmentQuestion, value: string[] | undefined) {
          if (this.type !== "MCQ") return true;
          return Array.isArray(value) && value.length === 4;
        },
        message: "Each MCQ question must have exactly 4 options",
      },
    },
    correctIndex: {
      type: Number,
      required: false,
      min: 0,
      max: 3,
      validate: {
        validator(this: IAssessmentQuestion, value: number | undefined) {
          if (this.type !== "MCQ") return true;
          return typeof value === "number" && value >= 0 && value <= 3;
        },
        message: "Each MCQ question must include a valid correct option",
      },
    },
    expectedAnswer: { type: String, trim: true },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessmentDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    durationMinutes: { type: Number, default: 10, min: 1 },
    isActive: { type: Boolean, default: true },
    questions: {
      type: [AssessmentQuestionSchema],
      required: true,
      validate: {
        validator(value: IAssessmentQuestion[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Assessment must contain at least 1 question",
      },
    },
  },
  { timestamps: true }
);

AssessmentSchema.index({ isActive: 1, createdAt: -1 });
AssessmentSchema.set("toJSON", { versionKey: false });

if (process.env.NODE_ENV !== "production" && models.Assessment) {
  delete (models as Record<string, unknown>).Assessment;
}

const Assessment =
  models.Assessment ?? model<IAssessmentDocument>("Assessment", AssessmentSchema);
export default Assessment;
