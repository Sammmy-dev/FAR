import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Client from "@/models/Client";
import JobsTable from "@/components/admin/JobsTable";
import type { IJob } from "@/types";

export const metadata: Metadata = { title: "Manage Jobs" };

async function getJobs(): Promise<IJob[]> {
  await connectDB();
  const jobs = await Job.find()
    .populate("clientId", "name")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(jobs));
}

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Jobs</h1>
        <Link
          href="/dashboard/jobs/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + New Job
        </Link>
      </div>
      <JobsTable jobs={jobs} />
    </div>
  );
}
