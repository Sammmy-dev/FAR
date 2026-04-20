import mongoose, { Schema, models, model } from "mongoose";
import type { JobType, ApplyMethod } from "@/types";

export interface IJobDocument extends mongoose.Document {
  title: string;
  description: string;
  location?: string;
  type: JobType;
  qualification?: string;
  applyInfo: ApplyMethod;
  isVisible: boolean;
  clientId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJobDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      required: true,
    },
    qualification: { type: String, trim: true },
    applyInfo: { type: String, enum: ["WHATSAPP", "EMAIL"], required: true },
    isVisible: { type: Boolean, default: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for fast public-facing queries (only visible jobs)
JobSchema.index({ isVisible: 1, createdAt: -1 });

JobSchema.set("toJSON", { versionKey: false });

// In development, delete the cached model on every hot-reload so schema
// changes (e.g. new fields) are reflected immediately without a server restart.
if (process.env.NODE_ENV !== "production" && models.Job) {
  delete (models as Record<string, unknown>).Job;
}

const Job = models.Job ?? model<IJobDocument>("Job", JobSchema);
export default Job;
