import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import type { IAssessment } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Assessments",
  description: "Take a short assessment to demonstrate your skills for FAR-placed positions.",
};

async function getActiveAssessments(): Promise<IAssessment[]> {
  try {
    await connectDB();
    const assessments = await Assessment.find({ isActive: true })
      .select("title description durationMinutes questions createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(assessments));
  } catch {
    return [];
  }
}

export default async function AssessmentsPage() {
  const assessments = await getActiveAssessments();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-neutral-900">Assessments</h1>
      <p className="mb-10 text-neutral-600">
        Complete a short test to show your skills. Results are reviewed by our team.
      </p>

      {assessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <p className="text-lg font-medium">No assessments available right now.</p>
          <p className="mt-1 text-sm">Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {assessments.map((a) => (
            <div
              key={a._id}
              className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">{a.title}</h2>
                {a.description && (
                  <p className="text-sm text-neutral-600">{a.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>{a.questions.length} question{a.questions.length !== 1 ? "s" : ""}</span>
                  <span>{a.durationMinutes} min</span>
                </div>
                <Link
                  href={`/assessments/${a._id}`}
                  className="bg-brand-gradient rounded px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
