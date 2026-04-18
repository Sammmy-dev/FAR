import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { JobSchema } from "@/lib/validations";

// GET /api/jobs — public gets visible only; admin gets all
export async function GET(req: Request) {
  const session = await auth();
  await connectDB();

  const filter = session ? {} : { isVisible: true };
  const jobs = await Job.find(filter)
    .populate("clientId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(jobs);
}

// POST /api/jobs — admin only
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = JobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const job = await Job.create(parsed.data);
  return NextResponse.json(job, { status: 201 });
}
