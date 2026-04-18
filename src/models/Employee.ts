import mongoose, { Schema, models, model } from "mongoose";
import type { EmployeeStatus } from "@/types";

export interface IEmployeeDocument extends mongoose.Document {
  name: string;
  role: string;
  clientId: mongoose.Types.ObjectId;
  startDate: Date;
  status: EmployeeStatus;
  phone?: string;
  email?: string;
  photoUrl?: string;
  photoPublicId?: string;
  // Financial — select: false; never returned unless explicitly included
  salary?: number;
  farFee?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployeeDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ON_LEAVE", "ENDED"],
      default: "ACTIVE",
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    photoUrl: { type: String },
    photoPublicId: { type: String },

    // ── Financial fields ─────────────────────────────────────────────────────
    // select: false means these are NEVER returned by any query unless the
    // query explicitly calls .select("+salary +farFee ...").
    // This is enforced at the DB layer, not just the API layer.
    salary: { type: Number, select: false },
    farFee: { type: Number, select: false },
    bankName: { type: String, trim: true, select: false },
    accountNumber: { type: String, trim: true, select: false },
    accountName: { type: String, trim: true, select: false },
  },
  { timestamps: true }
);

// Helper string for re-including financial fields in SUPER_ADMIN queries
export const FINANCIAL_SELECT =
  "+salary +farFee +bankName +accountNumber +accountName";

EmployeeSchema.index({ clientId: 1, status: 1 });
EmployeeSchema.set("toJSON", { versionKey: false });

const Employee =
  models.Employee ?? model<IEmployeeDocument>("Employee", EmployeeSchema);
export default Employee;
