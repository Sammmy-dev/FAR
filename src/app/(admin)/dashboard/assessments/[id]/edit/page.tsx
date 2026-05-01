import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import AssessmentForm from "@/components/admin/AssessmentForm";
import type { IAssessment } from "@/types";

export const metadata: Metadata = { title: "Edit Assessment" };

interface Props {
  params: { id: string };
}

async function getAssessment(id: string): Promise<IAssessment | null> {
  try {
    await connectDB();
    const a = await Assessment.findById(id).lean();
    if (!a) return null;
    return JSON.parse(JSON.stringify(a));
  } catch {
    return null;
  }
}

export default async function EditAssessmentPage({ params }: Props) {
  const assessment = await getAssessment(params.id);
  if (!assessment) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit Assessment</h1>
      <AssessmentForm assessment={assessment} />
    </div>
  );
}
