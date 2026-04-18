import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Client from "@/models/Client";
import JobForm from "@/components/admin/JobForm";
import type { IJob, IClient } from "@/types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: "Edit Job" };

async function getData(id: string) {
  await connectDB();
  const [job, clients] = await Promise.all([
    Job.findById(id).lean(),
    Client.find().select("name").sort({ name: 1 }).lean(),
  ]);
  return {
    job: job ? (JSON.parse(JSON.stringify(job)) as IJob) : null,
    clients: JSON.parse(JSON.stringify(clients)) as IClient[],
  };
}

export default async function EditJobPage({ params }: Props) {
  const { job, clients } = await getData(params.id);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit Job</h1>
      <JobForm clients={clients} job={job} />
    </div>
  );
}
