import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import { AssessmentUpdateSchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

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

// GET /api/assessments/[id] — public gets active assessment only (without answer keys)
// admin gets any assessment with full data
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  await connectDB();

  try {
    const assessment = await Assessment.findById(params.id).lean();
    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!session) {
      if (!assessment.isActive) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(stripAnswerKeys(assessment as unknown as Record<string, unknown>));
    }

    return NextResponse.json(assessment);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// PATCH /api/assessments/[id] — admin only
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = AssessmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const assessment = await Assessment.findByIdAndUpdate(params.id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// DELETE /api/assessments/[id] — admin only
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const assessment = await Assessment.findByIdAndDelete(params.id);
    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
