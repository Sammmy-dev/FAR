"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import type { IAssessmentPublic } from "@/types";

interface Props {
  assessment: IAssessmentPublic;
}

export default function ExamClient({ assessment }: Props) {
  const total = assessment.questions.length;
  const [responses, setResponses] = useState<
    {
      selectedIndex: number | null;
      typedAnswer: string;
    }[]
  >(
    assessment.questions.map(() => ({ selectedIndex: null, typedAnswer: "" }))
  );
  const [timeLeft, setTimeLeft] = useState(assessment.durationMinutes * 60);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Always-fresh ref so the timer effect never depends on handleSubmit
  const handleSubmitRef = useRef<(force?: boolean) => Promise<void>>(async () => {});
  // Prevents the timer from triggering auto-submit more than once
  const autoSubmittedRef = useRef(false);

  const handleSubmit = useCallback(
    async (force = false) => {
      if (!force) {
        const unanswered = assessment.questions.filter((question, idx) => {
          if (question.type === "MCQ") {
            return responses[idx].selectedIndex === null;
          }
          return !responses[idx].typedAnswer.trim();
        }).length;
        if (unanswered > 0) {
          toast.error(`Please answer all ${unanswered} remaining question(s).`);
          return;
        }
      }

      setSubmitting(true);
      try {
        const res = await fetch(`/api/assessments/${assessment._id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateName,
            candidateEmail: candidateEmail || undefined,
            responses: assessment.questions.map((question, idx) => ({
              questionType: question.type,
              selectedIndex:
                question.type === "MCQ" ? responses[idx].selectedIndex ?? undefined : undefined,
              typedAnswer:
                question.type === "OPEN_ENDED"
                  ? responses[idx].typedAnswer.trim()
                  : undefined,
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Submission failed");
          return;
        }

        setSubmitted(true);
      } catch {
        toast.error("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [responses, assessment._id, assessment.questions, candidateName, candidateEmail]
  );

  // Keep the ref in sync with the latest handleSubmit closure
  handleSubmitRef.current = handleSubmit;

  // Countdown timer — auto-submit when time runs out (force = true bypasses unanswered check)
  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        handleSubmitRef.current(true);
      }
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [started, submitted, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const timerUrgent = timeLeft <= 60;

  // ── Intro / candidate info form ────────────────────────────────────────────
  if (!started) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white p-8">
        <h2 className="mb-1 text-xl font-bold text-neutral-900">{assessment.title}</h2>
        {assessment.description && (
          <p className="mb-6 text-sm text-neutral-600">{assessment.description}</p>
        )}
        <div className="mb-6 flex gap-6 text-sm text-neutral-500">
          <span>{total} question{total !== 1 ? "s" : ""}</span>
          <span>{assessment.durationMinutes} minutes</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Email (optional)
            </label>
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!candidateName.trim()) {
              toast.error("Please enter your name.");
              return;
            }
            setStarted(true);
          }}
          className="mt-6 w-full bg-brand-gradient rounded px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-1 text-2xl font-bold text-neutral-900">Submitted!</h2>
        <p className="text-neutral-600">
          Thank you, <strong>{candidateName}</strong>. Your assessment has been received.
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Your result will be reviewed by our team and you will be contacted.
        </p>
        <a
          href="/assessments"
          className="mt-8 inline-block rounded bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Back to Assessments
        </a>
      </div>
    );
  }

  // ── Exam ───────────────────────────────────────────────────────────────────
  const answered = assessment.questions.filter((question, idx) => {
    if (question.type === "MCQ") {
      return responses[idx].selectedIndex !== null;
    }
    return responses[idx].typedAnswer.trim().length > 0;
  }).length;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Sticky header */}
      <div className="sticky top-16 z-10 mb-8 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-3 shadow-sm">
        <div>
          <p className="text-xs text-neutral-500">Progress</p>
          <p className="text-sm font-semibold text-neutral-800">
            {answered} / {total} answered
          </p>
        </div>
        <div
          className={`rounded px-4 py-1.5 font-mono text-lg font-bold tabular-nums ${
            timerUrgent ? "text-red-600" : "text-neutral-800"
          }`}
        >
          {minutes}:{seconds}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {assessment.questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="rounded-xl border border-neutral-200 bg-white p-6"
          >
            <p className="mb-4 text-sm font-medium text-neutral-900">
              <span className="mr-2 font-bold text-brand-500">{qIdx + 1}.</span>
              {q.prompt}
            </p>
            <div className="space-y-2">
              {q.type === "MCQ" && q.options ? (
                q.options.map((opt, oIdx) => {
                  const selected = responses[qIdx].selectedIndex === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() =>
                        setResponses((a) => {
                          const next = [...a];
                          next[qIdx] = { ...next[qIdx], selectedIndex: oIdx };
                          return next;
                        })
                      }
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        selected
                          ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                          : "border-neutral-200 text-neutral-700 hover:border-brand-300 hover:bg-brand-50/40"
                      }`}
                    >
                      <span className="mr-3 font-semibold">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })
              ) : (
                <textarea
                  rows={4}
                  value={responses[qIdx].typedAnswer}
                  onChange={(e) =>
                    setResponses((a) => {
                      const next = [...a];
                      next[qIdx] = { ...next[qIdx], typedAnswer: e.target.value };
                      return next;
                    })
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-700 focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-300"
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {total - answered} question{total - answered !== 1 ? "s" : ""} left
        </p>
        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="bg-brand-gradient rounded px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {submitting ? "Submitting…" : "Submit Answers"}
        </button>
      </div>
    </div>
  );
}
