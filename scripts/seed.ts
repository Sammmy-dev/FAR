/**
 * Seed script — creates the first SUPER_ADMIN user.
 *
 * Usage:
 *   pnpm seed
 *
 * Set SEED_EMAIL / SEED_PASSWORD / SEED_NAME env vars to override defaults,
 * or just edit the defaults below before running.
 *
 * Safe to run multiple times — skips creation if a user with that email
 * already exists.
 */

import dotenv from "dotenv";
import path from "path";

// Load .env (or .env.local) before importing anything that needs env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in your environment.");
  process.exit(1);
}

const SEED_EMAIL = process.env.SEED_EMAIL ?? "admin@far.ng";
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "ChangeMe123!";
const SEED_NAME = process.env.SEED_NAME ?? "FAR Super Admin";

async function seed() {
  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI as string);
  console.log("✅  Connected.");

  // Dynamically import the model AFTER connecting so mongoose is ready
  const { default: User } = await import("../src/models/User");

  const existing = await User.findOne({ email: SEED_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`ℹ️   User ${SEED_EMAIL} already exists — skipping.`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcryptjs.hash(SEED_PASSWORD, 12);

  await User.create({
    name: SEED_NAME,
    email: SEED_EMAIL.toLowerCase(),
    password: hashed,
    role: "SUPER_ADMIN",
  });

  console.log(`\n🎉  Created SUPER_ADMIN user:`);
  console.log(`    Email:    ${SEED_EMAIL}`);
  console.log(`    Password: ${SEED_PASSWORD}`);
  console.log(`\n⚠️   Delete this script output from your terminal history.`);
  console.log(`    Change the password immediately after first login.\n`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
