import mongoose, { Schema, models, model } from "mongoose";

export interface IClientDocument extends mongoose.Document {
  name: string;
  industry?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  logoPublicId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClientDocument>(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    logoUrl: { type: String },
    logoPublicId: { type: String },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

ClientSchema.set("toJSON", { versionKey: false });

const Client = models.Client ?? model<IClientDocument>("Client", ClientSchema);
export default Client;
