"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";
import type { IJob, IClient } from "@/types";

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

interface Props {
  jobs: IJob[];
}

export default function JobsTable({ jobs }: Props) {
  const router = useRouter();
  const [visibilities, setVisibilities] = useState<Record<string, boolean>>(
    () => Object.fromEntries(jobs.map((j) => [j._id, j.isVisible]))
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  async function toggleVisibility(id: string) {
    const current = visibilities[id];
    setVisibilities((v) => ({ ...v, [id]: !current }));
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success(current ? "Job hidden" : "Job published");
    } catch {
      setVisibilities((v) => ({ ...v, [id]: current }));
      toast.error("Failed to update visibility");
    }
  }

  async function deleteJob(id: string) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Job deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setDeleting(null);
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded bg-surface-lowest p-12 text-center text-neutral-400">
        No jobs yet. <a href="/dashboard/jobs/new" className="text-brand-500 underline">Create one.</a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:hidden">
        {jobs.map((job) => {
          const client = typeof job.clientId === "object" ? (job.clientId as IClient) : null;
          return (
            <div key={job._id} className="rounded bg-surface-lowest p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-neutral-900">{job.title}</h3>
                  <p className="text-xs text-neutral-500">{client?.name ?? "-"}</p>
                </div>
                <span className="rounded bg-brand-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-brand-600">
                  {JOB_TYPE_LABELS[job.type] ?? job.type}
                </span>
              </div>

              <div className="space-y-1 text-xs text-neutral-600">
                <p>Location: {job.location ?? "-"}</p>
                <p>Created: {formatDate(job.createdAt)}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleVisibility(job._id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    visibilities[job._id] ? "bg-brand-gradient" : "bg-neutral-300"
                  }`}
                  title={visibilities[job._id] ? "Click to hide" : "Click to publish"}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      visibilities[job._id] ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <div className="flex gap-2">
                  <a
                    href={`/dashboard/jobs/${job._id}/edit`}
                    className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => deleteJob(job._id)}
                    disabled={deleting === job._id}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting === job._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded bg-surface-lowest lg:block">
        <table className="min-w-[980px] whitespace-nowrap text-sm w-full">
        <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Visible</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {jobs.map((job) => {
            const client = typeof job.clientId === "object" ? job.clientId as IClient : null;
            return (
              <tr key={job._id} className="odd:bg-surface-lowest even:bg-surface transition-colors hover:bg-surface">
                <td className="px-4 py-3.5 font-medium text-neutral-900">{job.title}</td>
                <td className="px-4 py-3.5 text-neutral-600">{client?.name ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded bg-brand-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-brand-600">
                    {JOB_TYPE_LABELS[job.type] ?? job.type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-neutral-600">{job.location ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => toggleVisibility(job._id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                      visibilities[job._id] ? "bg-brand-gradient" : "bg-neutral-300"
                    }`}
                    title={visibilities[job._id] ? "Click to hide" : "Click to publish"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        visibilities[job._id] ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3.5 text-neutral-500">{formatDate(job.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <a
                      href={`/dashboard/jobs/${job._id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => deleteJob(job._id)}
                      disabled={deleting === job._id}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === job._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </>
  );
}
