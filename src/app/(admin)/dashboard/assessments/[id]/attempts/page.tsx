import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";
import AssessmentAttempt from "@/models/AssessmentAttempt";
import { formatDate } from "@/lib/utils";
import type { IAssessmentAttempt } from "@/types";
import { Fragment } from "react";

export const metadata: Metadata = { title: "Assessment Results" };

interface Props {
  params: { id: string };
}

export default async function AssessmentAttemptsPage({ params }: Props) {
  await connectDB();

  let assessment;
  let attempts: IAssessmentAttempt[] = [];

  try {
    assessment = await Assessment.findById(params.id).select("title durationMinutes questions").lean();
    if (!assessment) notFound();

    const raw = await AssessmentAttempt.find({ assessmentId: params.id })
      .sort({ submittedAt: -1 })
      .lean();
    attempts = JSON.parse(JSON.stringify(raw));
  } catch {
    notFound();
  }

  const passCount = attempts.filter((a) => a.score / a.total >= 0.5).length;

  function getResponseRows(attempt: IAssessmentAttempt) {
    if (Array.isArray(attempt.responses) && attempt.responses.length > 0) {
      return attempt.responses;
    }

    return (assessment?.questions ?? []).map((question, index) => {
      const questionType = question.type ?? "MCQ";
      const selectedIndex = attempt.answers?.[index];
      const selectedOption =
        typeof selectedIndex === "number" && selectedIndex >= 0
          ? question.options?.[selectedIndex]
          : undefined;
      return {
        questionPrompt: question.prompt,
        questionType,
        selectedIndex: selectedIndex >= 0 ? selectedIndex : undefined,
        selectedOption,
        correctIndex: question.correctIndex,
        correctOption:
          typeof question.correctIndex === "number"
            ? question.options?.[question.correctIndex]
            : undefined,
        expectedAnswer: question.expectedAnswer,
        isCorrect:
          questionType === "MCQ" &&
          typeof selectedIndex === "number" &&
          selectedIndex >= 0 &&
          selectedIndex === question.correctIndex,
      };
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard/assessments"
          className="text-sm text-neutral-500 hover:text-brand-500 transition-colors"
        >
          ← Assessments
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{assessment!.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {attempts.length} submission{attempts.length !== 1 ? "s" : ""} · {passCount} passed (≥50%)
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="rounded bg-surface-lowest p-12 text-center text-neutral-400">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded bg-surface-lowest">
          <table className="min-w-[640px] w-full whitespace-nowrap text-sm">
            <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => {
                const pct = Math.round((attempt.score / attempt.total) * 100);
                const passed = pct >= 50;
                const responseRows = getResponseRows(attempt);
                return (
                  <Fragment key={attempt._id}>
                    <tr className="odd:bg-surface-lowest even:bg-surface">
                      <td className="px-4 py-3 font-medium text-neutral-900">
                        {attempt.candidateName}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {attempt.candidateEmail ?? "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-neutral-700">
                        {attempt.score} / {attempt.total} ({pct}%)
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                            passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {formatDate(attempt.submittedAt)}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td colSpan={5} className="px-4 pb-4">
                        <details>
                          <summary className="cursor-pointer py-2 text-xs font-semibold uppercase tracking-wide text-brand-500">
                            View Candidate Answers
                          </summary>
                          <div className="mt-3 space-y-3">
                            {responseRows.map((response, idx) => (
                              <div key={`${attempt._id}-${idx}`} className="rounded border border-neutral-200 bg-neutral-50 p-3">
                                <p className="mb-2 text-sm font-medium text-neutral-900">
                                  Q{idx + 1}. {response.questionPrompt}
                                </p>
                                {response.questionType === "MCQ" ? (
                                  <div className="space-y-1 text-xs text-neutral-700">
                                    <p>
                                      Candidate choice: {response.selectedOption ?? "No choice"}
                                    </p>
                                    <p>
                                      Correct answer: {response.correctOption ?? "Not set"}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-1 text-xs text-neutral-700">
                                    <p>
                                      Candidate answer: {response.typedAnswer ?? "No answer"}
                                    </p>
                                    <p>
                                      Expected answer: {response.expectedAnswer ?? "Not set"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </details>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
