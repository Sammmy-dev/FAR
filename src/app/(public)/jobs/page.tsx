import type { Metadata } from "next";
import JobCard from "@/components/public/JobCard";
import type { IJob } from "@/types";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import "@/models/Client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Open Positions",
  description: "Browse all current job openings available through FAR.",
};

async function getVisibleJobs(): Promise<IJob[]> {
  await connectDB();
  const jobs = await Job.find({ isVisible: true })
    .populate("clientId", "name")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(jobs));
}

export default async function JobsPage() {
  const jobs = await getVisibleJobs();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-neutral-900">
        Open Positions
      </h1>
      <p className="mb-10 text-neutral-600">
        Find your next opportunity through FAR.
      </p>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
          <p className="text-lg font-medium">No openings at the moment.</p>
          <p className="mt-1 text-sm">Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
