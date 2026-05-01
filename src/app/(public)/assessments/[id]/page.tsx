import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import ExamClient from "./ExamClient";
import type { IAssessmentPublic } from "@/types";

interface Props {
  params: { id: string };
}

async function getAssessment(id: string): Promise<IAssessmentPublic | null> {
  try {
    await connectDB();
    const assessment = await Assessment.findOne({ _id: id, isActive: true }).lean();
    if (!assessment) return null;

    const safeQuestions: IAssessmentPublic["questions"] = [];
    for (const rawQuestion of assessment.questions as Array<{
      type?: "MCQ" | "OPEN_ENDED";
      prompt: string;
      options?: [string, string, string, string];
    }>) {
      safeQuestions.push({
        type: rawQuestion.type ?? "MCQ",
        prompt: rawQuestion.prompt,
        options: rawQuestion.options,
      });
    }

    // Strip correctIndex before sending to client
    const safe: IAssessmentPublic = {
      _id: String(assessment._id),
      title: assessment.title,
      description: assessment.description,
      durationMinutes: assessment.durationMinutes,
      isActive: assessment.isActive,
      questions: safeQuestions,
      createdAt: String(assessment.createdAt),
      updatedAt: String(assessment.updatedAt),
    };
    return safe;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAssessment(params.id);
  if (!a) return { title: "Assessment Not Found" };
  return { title: a.title, description: a.description };
}

export default async function AssessmentExamPage({ params }: Props) {
  const assessment = await getAssessment(params.id);
  if (!assessment) notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <ExamClient assessment={assessment} />
    </section>
  );
}
