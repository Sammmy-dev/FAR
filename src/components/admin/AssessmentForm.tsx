"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { IAssessment, IAssessmentQuestion } from "@/types";

interface Props {
  assessment?: IAssessment;
}

const BLANK_QUESTION: IAssessmentQuestion = {
  type: "MCQ",
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
};

export default function AssessmentForm({ assessment }: Props) {
  const router = useRouter();
  const isEdit = !!assessment;

  const [title, setTitle] = useState(assessment?.title ?? "");
  const [description, setDescription] = useState(assessment?.description ?? "");
  const [durationMinutes, setDurationMinutes] = useState(
    assessment?.durationMinutes ?? 15
  );
  const [isActive, setIsActive] = useState(assessment?.isActive ?? true);
  const [questions, setQuestions] = useState<IAssessmentQuestion[]>(
    assessment?.questions && assessment.questions.length > 0
      ? assessment.questions.map((question) => {
          if (question.type) return question;
          return {
            ...question,
            type: "MCQ",
          };
        })
      : [structuredClone(BLANK_QUESTION)]
  );
  const [loading, setLoading] = useState(false);

  // ─── Question helpers ────────────────────────────────────────────────────────

  function addQuestion() {
    setQuestions((q) => [...q, structuredClone(BLANK_QUESTION)]);
  }

  function removeQuestion(idx: number) {
    setQuestions((q) => q.filter((_, i) => i !== idx));
  }

  function updatePrompt(idx: number, value: string) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === idx ? { ...question, prompt: value } : question
      )
    );
  }

  function updateType(idx: number, type: "MCQ" | "OPEN_ENDED") {
    setQuestions((q) =>
      q.map((question, i) => {
        if (i !== idx) return question;
        if (type === "MCQ") {
          return {
            type,
            prompt: question.prompt,
            options: question.options ?? ["", "", "", ""],
            correctIndex: typeof question.correctIndex === "number" ? question.correctIndex : 0,
          };
        }
        return {
          type,
          prompt: question.prompt,
          expectedAnswer: question.expectedAnswer ?? "",
        };
      })
    );
  }

  function updateOption(qIdx: number, oIdx: number, value: string) {
    setQuestions((q) =>
      q.map((question, i) => {
        if (i !== qIdx) return question;
        const options = [...(question.options ?? ["", "", "", ""])] as [string, string, string, string];
        options[oIdx] = value;
        return { ...question, options };
      })
    );
  }

  function updateCorrect(qIdx: number, value: number) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx ? { ...question, correctIndex: value } : question
      )
    );
  }

  function updateExpectedAnswer(qIdx: number, value: string) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx ? { ...question, expectedAnswer: value } : question
      )
    );
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (questions.length === 0) {
      toast.error("Add at least one question.");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt.trim()) {
        toast.error(`Question ${i + 1} is missing a prompt.`);
        return;
      }
      if (q.type === "MCQ") {
        if (!q.options || q.options.some((o) => !o.trim())) {
          toast.error(`Question ${i + 1} has an empty option.`);
          return;
        }
        if (typeof q.correctIndex !== "number") {
          toast.error(`Question ${i + 1} needs a correct answer.`);
          return;
        }
      }
    }

    setLoading(true);
    const payload = { title, description, durationMinutes, isActive, questions };

    try {
      const res = await fetch(
        isEdit ? `/api/assessments/${assessment._id}` : "/api/assessments",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save assessment");
        return;
      }

      toast.success(isEdit ? "Assessment updated" : "Assessment created");
      router.push("/dashboard/assessments");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const inputCls =
    "w-full rounded border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400";
  const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── General info ─────────────────────────────────────────────────── */}
      <div className="rounded border border-neutral-200 bg-white p-6 space-y-5">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
          General Info
        </h2>

        <div>
          <label className={labelCls}>Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="e.g. General Aptitude Test"
          />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
            placeholder="Brief description shown to candidates"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[140px]">
            <label className={labelCls}>Duration (minutes) *</label>
            <input
              type="number"
              required
              min={1}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div className="flex items-center gap-3 pt-5">
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                isActive ? "bg-brand-gradient" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-neutral-600">
              {isActive ? "Active (visible to candidates)" : "Inactive (hidden)"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Questions ────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
            Questions ({questions.length})
          </h2>
          <button
            type="button"
            onClick={addQuestion}
            className="rounded border border-brand-300 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
          >
            + Add Question
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="rounded border border-neutral-200 bg-white p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold text-brand-500 mt-0.5">
                Q{qIdx + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className={labelCls}>Question prompt *</label>
              <textarea
                rows={2}
                required
                value={q.prompt}
                onChange={(e) => updatePrompt(qIdx, e.target.value)}
                className={inputCls}
                placeholder="Enter the question here…"
              />
            </div>

            <div>
              <label className={labelCls}>Question type</label>
              <select
                value={q.type}
                onChange={(e) =>
                  updateType(qIdx, e.target.value as "MCQ" | "OPEN_ENDED")
                }
                className={inputCls}
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="OPEN_ENDED">Open Ended</option>
              </select>
            </div>

            {q.type === "MCQ" ? (
              <div className="space-y-2">
                <label className={labelCls}>Options (mark the correct one)</label>
                {(q.options ?? ["", "", "", ""]).map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctIndex === oIdx}
                      onChange={() => updateCorrect(qIdx, oIdx)}
                      className="accent-brand-500"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder={`Option ${oIdx + 1}`}
                    />
                    {q.correctIndex === oIdx && (
                      <span className="text-xs font-semibold text-green-600 whitespace-nowrap">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label className={labelCls}>Expected answer (optional)</label>
                <textarea
                  rows={2}
                  value={q.expectedAnswer ?? ""}
                  onChange={(e) => updateExpectedAnswer(qIdx, e.target.value)}
                  className={inputCls}
                  placeholder="Use this for auto-checking exact answer matches"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-gradient rounded px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {loading ? "Saving…" : isEdit ? "Update Assessment" : "Create Assessment"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
