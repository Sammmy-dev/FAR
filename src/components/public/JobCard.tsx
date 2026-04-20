import Link from "next/link";
import { HiLocationMarker } from "react-icons/hi";
import { formatDate, JOB_TYPE_LABELS } from "@/lib/utils";
import type { IJob } from "@/types";

const TYPE_BADGE: Record<string, string> = {
  FULL_TIME: "bg-green-100 text-green-700",
  PART_TIME: "bg-blue-100 text-blue-700",
  CONTRACT: "bg-yellow-100 text-yellow-700",
  INTERNSHIP: "bg-purple-100 text-purple-700",
};

interface Props {
  job: IJob;
}

export default function JobCard({ job }: Props) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group flex flex-col rounded bg-surface-lowest p-6 border-ghost"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 group-hover:text-brand-500 transition-colors leading-snug">
            {job.title}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 rounded px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
            TYPE_BADGE[job.type] ?? "bg-neutral-100 text-neutral-600"
          }`}
        >
          {JOB_TYPE_LABELS[job.type] ?? job.type}
        </span>
      </div>

      {/* Location */}
      {job.location && (
        <div className="mb-3 flex items-center gap-1.5 text-sm text-neutral-500">
          <HiLocationMarker className="h-4 w-4 flex-shrink-0" />
          {job.location}
        </div>
      )}

      {/* Description snippet */}
      {job.description && (
        <p className="mb-4 flex-1 text-sm text-neutral-700 line-clamp-3 leading-relaxed">
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-xs text-neutral-400">
          {formatDate(job.createdAt)}
        </span>
        <span className="text-xs font-semibold text-brand-500 group-hover:underline">
          View Details &rarr;
        </span>
      </div>
    </Link>
  );
}
