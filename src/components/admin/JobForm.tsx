"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { IJob, IClient } from "@/types";

interface Props {
  clients: IClient[];
  job?: IJob;
}

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

export default function JobForm({ clients, job }: Props) {
  const router = useRouter();
  const isEdit = !!job;

  const [form, setForm] = useState({
    title: job?.title ?? "",
    clientId: typeof job?.clientId === "object" ? job.clientId._id : (job?.clientId ?? ""),
    type: job?.type ?? "FULL_TIME",
    location: job?.location ?? "",
    description: job?.description ?? "",
    qualification: job?.qualification ?? "",
    applyInfo: job?.applyInfo ?? "EMAIL",
    isVisible: job?.isVisible ?? true,
  });
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/jobs/${job._id}` : "/api/jobs";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save job");
        return;
      }

      toast.success(isEdit ? "Job updated" : "Job created");
      router.push("/dashboard/jobs");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder:text-neutral-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-7 rounded bg-surface-lowest p-8">
      <div>
        <label className={labelClass}>Job Title *</label>
        <input className={inputClass} required value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Client *</label>
        <select className={inputClass} required value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
          <option value="">Select a client…</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Job Type *</label>
          <select className={inputClass} required value={form.type} onChange={(e) => set("type", e.target.value)}>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Lagos, Nigeria" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          className={`${inputClass} min-h-[140px] resize-y`}
          required
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Role description, responsibilities, requirements…"
        />
      </div>

      <div>
        <label className={labelClass}>Qualification</label>
        <input
          className={inputClass}
          value={form.qualification}
          onChange={(e) => set("qualification", e.target.value)}
          placeholder="e.g. OND / HND / B.Sc in relevant field"
        />
      </div>

      <div>
        <label className={labelClass}>How to Apply *</label>
        <select
          className={inputClass}
          required
          value={form.applyInfo}
          onChange={(e) => set("applyInfo", e.target.value)}
        >
          <option value="EMAIL">Email (flavour.hr.airhis@gmail.com)</option>
          <option value="WHATSAPP">WhatsApp (+2347075727762)</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set("isVisible", !form.isVisible)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            form.isVisible ? "bg-brand-500" : "bg-neutral-300"
          }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isVisible ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
        <span className="text-sm text-neutral-700">
          {form.isVisible ? "Visible on public portal" : "Hidden from public portal"}
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-gradient rounded px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {loading ? "Saving…" : isEdit ? "Update Job" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
