import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { JobUpdateSchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

// GET /api/jobs/[id] — public
export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const job = await Job.findById(params.id).populate("clientId", "name").lean();
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}

// PATCH /api/jobs/[id] — admin only
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = JobUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const job = await Job.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}

// DELETE /api/jobs/[id] — admin only
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const job = await Job.findByIdAndDelete(params.id);
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
