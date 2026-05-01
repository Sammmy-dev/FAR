import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import AssessmentAttempt from "@/models/AssessmentAttempt";

interface Params {
  params: { id: string };
}

// GET /api/assessments/[id]/attempts — admin only
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const attempts = await AssessmentAttempt.find({ assessmentId: params.id })
      .sort({ submittedAt: -1 })
      .lean();
    return NextResponse.json(JSON.parse(JSON.stringify(attempts)));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
