import mongoose, { Schema, models, model } from "mongoose";
import type { UserRole } from "@/types";

export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "STAFF"],
      default: "STAFF",
    },
  },
  { timestamps: true }
);

// Remove __v from JSON output
UserSchema.set("toJSON", { versionKey: false });

const User = models.User ?? model<IUserDocument>("User", UserSchema);
export default User;
