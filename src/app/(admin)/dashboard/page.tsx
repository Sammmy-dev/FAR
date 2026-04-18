import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Client from "@/models/Client";
import Employee from "@/models/Employee";
import type { DashboardStats } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats(): Promise<DashboardStats> {
  await connectDB();
  const [totalClients, totalJobs, activeJobs, totalEmployees, activeEmployees] =
    await Promise.all([
      Client.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ isVisible: true }),
      Employee.countDocuments(),
      Employee.countDocuments({ status: "ACTIVE" }),
    ]);
  return { totalClients, totalJobs, activeJobs, totalEmployees, activeEmployees };
}

const STAT_CARDS = [
  { key: "totalClients" as const, label: "Total Clients", color: "text-blue-600" },
  { key: "totalJobs" as const, label: "Total Jobs", color: "text-purple-600" },
  { key: "activeJobs" as const, label: "Active Listings", color: "text-green-600" },
  { key: "totalEmployees" as const, label: "Total Employees", color: "text-brand-500" },
  { key: "activeEmployees" as const, label: "Active Employees", color: "text-brand-600" },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-extrabold text-neutral-900">Dashboard</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {STAT_CARDS.map(({ key, label, color }) => (
          <div
            key={key}
            className="rounded bg-surface-lowest p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">{label}</p>
            <p className={`mt-3 text-4xl font-extrabold ${color}`}>
              {stats[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
