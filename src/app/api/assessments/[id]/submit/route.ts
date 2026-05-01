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

    if (responses.length !== total) {
      return NextResponse.json(
        { error: "Please answer all questions before submitting." },
        { status: 400 }
      );
    }

    let score = 0;
    const detailedResponses = assessment.questions.map((question, index) => {
      const response = responses[index];
      const questionType = question.type ?? "MCQ";

      if (questionType === "MCQ") {
        if (typeof response.selectedIndex !== "number") {
          throw new Error("INVALID_MCQ_ANSWER");
        }
        const selectedOption = question.options?.[response.selectedIndex] ?? "";
        const correctIndex = question.correctIndex;
        const isCorrect =
          typeof correctIndex === "number" && response.selectedIndex === correctIndex;
        if (isCorrect) score += 1;

        return {
          questionPrompt: question.prompt,
          questionType,
          selectedIndex: response.selectedIndex,
          selectedOption,
          correctIndex,
          correctOption:
            typeof correctIndex === "number" ? question.options?.[correctIndex] : undefined,
          isCorrect,
        };
      }

      const typedAnswer = (response.typedAnswer ?? "").trim();
      if (!typedAnswer) {
        throw new Error("INVALID_OPEN_ENDED_ANSWER");
      }

      const expectedAnswer = (question.expectedAnswer ?? "").trim();
      const isCorrect =
        expectedAnswer.length > 0 &&
        typedAnswer.toLowerCase() === expectedAnswer.toLowerCase();
      if (isCorrect) score += 1;

      return {
        questionPrompt: question.prompt,
        questionType,
        typedAnswer,
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
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_MCQ_ANSWER") {
      return NextResponse.json(
        { error: "Please choose an option for every multiple-choice question." },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "INVALID_OPEN_ENDED_ANSWER") {
      return NextResponse.json(
        { error: "Please type an answer for every open-ended question." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }
}
