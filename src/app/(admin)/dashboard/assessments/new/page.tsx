import type { Metadata } from "next";
import AssessmentForm from "@/components/admin/AssessmentForm";

export const metadata: Metadata = { title: "New Assessment" };

export default function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">New Assessment</h1>
      <AssessmentForm />
    </div>
  );
}
