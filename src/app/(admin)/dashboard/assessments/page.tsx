import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import AssessmentsTable from "@/components/admin/AssessmentsTable";
import type { IAssessment } from "@/types";

export const metadata: Metadata = { title: "Manage Assessments" };

async function getAssessments(): Promise<IAssessment[]> {
  await connectDB();
  const assessments = await Assessment.find()
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(assessments));
}

export default async function AdminAssessmentsPage() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Assessments</h1>
        <Link
          href="/dashboard/assessments/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + New Assessment
        </Link>
      </div>
      <AssessmentsTable assessments={assessments} />
    </div>
  );
}
