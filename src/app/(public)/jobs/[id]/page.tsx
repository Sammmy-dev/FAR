import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { IJob } from "@/types";

interface Props {
  params: { id: string };
}

async function getJob(id: string): Promise<IJob | null> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/jobs/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.id);
  if (!job) return { title: "Job Not Found" };
  return {
    title: job.title,
    description: job.description.slice(0, 155),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.id);

  if (!job || !job.isVisible) {
    notFound();
  }

  const client = typeof job.clientId === "object" ? job.clientId : null;

  const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          {JOB_TYPE_LABELS[job.type] ?? job.type}
        </span>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-neutral-900">{job.title}</h1>

      <div className="mb-8 flex flex-wrap gap-4 text-sm text-neutral-500">
        {client && <span>{client.name}</span>}
        {job.location && <span>{job.location}</span>}
        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          How to Apply
        </h2>
        <p className="whitespace-pre-wrap text-neutral-700">{job.applyInfo}</p>
      </div>
    </article>
  );
}
