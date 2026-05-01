import mongoose, { Schema, models, model } from "mongoose";

export interface IAssessmentAttemptDocument extends mongoose.Document {
  assessmentId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail?: string;
  responses: {
    questionPrompt: string;
    questionType: "MCQ" | "OPEN_ENDED";
    selectedIndex?: number;
    selectedOption?: string;
    typedAnswer?: string;
    correctIndex?: number;
    correctOption?: string;
    expectedAnswer?: string;
    isCorrect?: boolean;
  }[];
  answers: number[];
  score: number;
  total: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttemptDocument>(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },
    candidateName: { type: String, required: true, trim: true },
    candidateEmail: { type: String, trim: true, lowercase: true },
    responses: {
      type: [
        {
          questionPrompt: { type: String, required: true },
          questionType: {
            type: String,
            enum: ["MCQ", "OPEN_ENDED"],
            required: true,
          },
          selectedIndex: { type: Number, min: 0, max: 3 },
          selectedOption: { type: String },
          typedAnswer: { type: String },
          correctIndex: { type: Number, min: 0, max: 3 },
          correctOption: { type: String },
          expectedAnswer: { type: String },
          isCorrect: { type: Boolean },
        },
      ],
      default: [],
      required: true,
    },
    // Legacy field kept for backward compatibility with old submissions
    answers: { type: [Number], required: true, default: [] },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    submittedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

AssessmentAttemptSchema.index({ assessmentId: 1, submittedAt: -1 });
AssessmentAttemptSchema.set("toJSON", { versionKey: false });

if (process.env.NODE_ENV !== "production" && models.AssessmentAttempt) {
  delete (models as Record<string, unknown>).AssessmentAttempt;
}

const AssessmentAttempt =
  models.AssessmentAttempt ??
  model<IAssessmentAttemptDocument>("AssessmentAttempt", AssessmentAttemptSchema);

export default AssessmentAttempt;
