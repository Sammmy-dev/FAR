import Link from "next/link";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import JobCard from "@/components/public/JobCard";
import type { IJob } from "@/types";

async function getFeaturedJobs(): Promise<IJob[]> {
  await connectDB();
  const jobs = await Job.find({ isVisible: true })
    .populate("clientId", "name")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  return JSON.parse(JSON.stringify(jobs));
}

export default async function FeaturedJobs() {
  const jobs = await getFeaturedJobs();

  return (
    <section id="jobs" className="py-24 bg-surface-lowest">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
              Opportunities
            </p>
            <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
              Featured Open Positions
            </h2>
          </div>
          <Link
            href="/jobs"
            className="hidden text-sm font-semibold text-brand-500 hover:underline sm:block"
          >
            View all &rarr;
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
            <p className="text-base font-medium">No openings at the moment.</p>
            <p className="mt-1 text-sm">Check back soon — new roles are added regularly.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/jobs"
                className="text-sm font-semibold text-brand-500 hover:underline"
              >
                View all positions &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
