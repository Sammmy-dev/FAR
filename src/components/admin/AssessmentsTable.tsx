"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import type { IAssessment } from "@/types";

interface Props {
  assessments: IAssessment[];
}

export default function AssessmentsTable({ assessments }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(assessments);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function toggleActive(id: string, current: boolean) {
    setToggling(id);
    try {
      const res = await fetch(`/api/assessments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error();
      setItems((list) =>
        list.map((a) => (a._id === id ? { ...a, isActive: !current } : a))
      );
      toast.success(current ? "Assessment deactivated" : "Assessment activated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((list) => list.filter((a) => a._id !== id));
      toast.success("Assessment deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete assessment");
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded bg-surface-lowest p-12 text-center text-neutral-400">
        No assessments yet.{" "}
        <a href="/dashboard/assessments/new" className="text-brand-500 underline">
          Create one.
        </a>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile cards ──────────────────────────────────────────────────── */}
      <div className="space-y-4 lg:hidden">
        {items.map((a) => (
          <div key={a._id} className="rounded bg-surface-lowest p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-neutral-900">{a.title}</h3>
                <p className="text-xs text-neutral-500">
                  {a.questions.length} question{a.questions.length !== 1 ? "s" : ""} ·{" "}
                  {a.durationMinutes} min
                </p>
              </div>
              <button
                onClick={() => toggleActive(a._id, a.isActive)}
                disabled={toggling === a._id}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  a.isActive ? "bg-brand-gradient" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    a.isActive ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`/dashboard/assessments/${a._id}/edit`}
                className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
              >
                Edit
              </a>
              <a
                href={`/dashboard/assessments/${a._id}/attempts`}
                className="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-surface"
              >
                Results
              </a>
              <button
                onClick={() => handleDelete(a._id, a.title)}
                disabled={deleting === a._id}
                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting === a._id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────────── */}
      <div className="hidden overflow-x-auto rounded bg-surface-lowest lg:block">
        <table className="min-w-[760px] w-full whitespace-nowrap text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr
                key={a._id}
                className="odd:bg-surface-lowest even:bg-surface transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3.5 font-medium text-neutral-900">{a.title}</td>
                <td className="px-4 py-3.5 text-neutral-600">{a.questions.length}</td>
                <td className="px-4 py-3.5 text-neutral-600">{a.durationMinutes} min</td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => toggleActive(a._id, a.isActive)}
                    disabled={toggling === a._id}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                      a.isActive ? "bg-brand-gradient" : "bg-neutral-300"
                    }`}
                    title={a.isActive ? "Click to deactivate" : "Click to activate"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        a.isActive ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3.5 text-neutral-500">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <a
                      href={`/dashboard/assessments/${a._id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                    >
                      Edit
                    </a>
                    <a
                      href={`/dashboard/assessments/${a._id}/attempts`}
                      className="rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-surface"
                    >
                      Results
                    </a>
                    <button
                      onClick={() => handleDelete(a._id, a.title)}
                      disabled={deleting === a._id}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === a._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
