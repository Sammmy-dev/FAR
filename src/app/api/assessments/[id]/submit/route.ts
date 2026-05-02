import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import AssessmentAttempt from "@/models/AssessmentAttempt";
import { AssessmentSubmitSchema } from "@/lib/validations";
import type { IAssessment } from "@/types";

interface Params {
  params: { id: string };
}

// POST /api/assessments/[id]/submit — public
export async function POST(req: Request, { params }: Params) {
  const body = await req.json();
  const parsed = AssessmentSubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const assessment = (await Assessment.findOne({ _id: params.id, isActive: true }).lean()) as IAssessment | null;
    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    const total = assessment.questions.length;
    const responses = parsed.data.responses;

    let score = 0;
    const detailedResponses = assessment.questions.map((question, index) => {
      const response = responses[index];
      const questionType = question.type ?? "MCQ";

      if (questionType === "MCQ") {
        // Treat unanswered (e.g. timer expired) as skipped — score 0, no error
        const selectedIndex = typeof response.selectedIndex === "number" ? response.selectedIndex : null;
        const correctIndex = question.correctIndex;
        const isCorrect =
          selectedIndex !== null &&
          typeof correctIndex === "number" &&
          selectedIndex === correctIndex;
        if (isCorrect) score += 1;

        return {
          questionPrompt: question.prompt,
          questionType,
          selectedIndex: selectedIndex ?? undefined,
          selectedOption: selectedIndex !== null ? (question.options?.[selectedIndex] ?? "") : "(skipped)",
          correctIndex,
          correctOption:
            typeof correctIndex === "number" ? question.options?.[correctIndex] : undefined,
          isCorrect,
        };
      }

      // Open-ended — treat empty as skipped
      const typedAnswer = (response.typedAnswer ?? "").trim();
      const expectedAnswer = (question.expectedAnswer ?? "").trim();
      const isCorrect =
        typedAnswer.length > 0 &&
        expectedAnswer.length > 0 &&
        typedAnswer.toLowerCase() === expectedAnswer.toLowerCase();
      if (isCorrect) score += 1;

      return {
        questionPrompt: question.prompt,
        questionType,
        typedAnswer: typedAnswer || "(skipped)",
        expectedAnswer: expectedAnswer || undefined,
        isCorrect,
      };
    });

    const legacyAnswers = detailedResponses.map((item) =>
      typeof item.selectedIndex === "number" ? item.selectedIndex : -1
    );

    await AssessmentAttempt.create({
      assessmentId: assessment._id,
      candidateName: parsed.data.candidateName,
      candidateEmail: parsed.data.candidateEmail || undefined,
      responses: detailedResponses,
      answers: legacyAnswers,
      score,
      total,
      submittedAt: new Date(),
    });

    return NextResponse.json({
      score,
      total,
      percentage: Math.round((score / total) * 100),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
