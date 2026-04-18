import mongoose, { Schema, models, model } from "mongoose";
import type { JobType } from "@/types";

export interface IJobDocument extends mongoose.Document {
  title: string;
  description: string;
  location?: string;
  type: JobType;
  applyInfo: string;
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
    applyInfo: { type: String, required: true, trim: true },
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

const Job = models.Job ?? model<IJobDocument>("Job", JobSchema);
export default Job;
