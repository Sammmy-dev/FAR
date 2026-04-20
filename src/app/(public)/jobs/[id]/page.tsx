import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { IJob } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

async function getJob(id: string): Promise<IJob | null> {
  const baseUrl = process.env.NEXTAUTH_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
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
        {job.location && <span>{job.location}</span>}
        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      {job.qualification && (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="mb-2 text-base font-semibold text-neutral-900">Qualification</h2>
          <p className="text-sm text-neutral-700">{job.qualification}</p>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          How to Apply
        </h2>
        {job.applyInfo === "WHATSAPP" ? (
          <a
            href="https://wa.me/2347075727762"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Apply via WhatsApp
          </a>
        ) : (
          <a
            href="mailto:flavour.hr.airhis@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Apply via Email
          </a>
        )}
      </div>
    </article>
  );
}
