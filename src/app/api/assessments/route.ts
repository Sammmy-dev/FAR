import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import { AssessmentSchema } from "@/lib/validations";

function stripAnswerKeys(assessment: Record<string, unknown>) {
  const questions = Array.isArray(assessment.questions)
    ? assessment.questions.map((q) => {
        const {
          correctIndex: _ignored,
          expectedAnswer: _ignoredExpected,
          ...rest
        } = q as Record<string, unknown>;
        return rest;
      })
    : [];

  return {
    ...assessment,
    questions,
  };
}

// GET /api/assessments — public gets active assessments only (without answers)
// admin gets all assessments (including answer keys)
export async function GET() {
  const session = await auth();
  await connectDB();

  const assessments = await Assessment.find(session ? {} : { isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  if (!session) {
    return NextResponse.json(assessments.map((a) => stripAnswerKeys(a as unknown as Record<string, unknown>)));
  }

  return NextResponse.json(assessments);
}

// POST /api/assessments — admin only
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = AssessmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();
  const assessment = await Assessment.create(parsed.data);
  return NextResponse.json(assessment, { status: 201 });
}
