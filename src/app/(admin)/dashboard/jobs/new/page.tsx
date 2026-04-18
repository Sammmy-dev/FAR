import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import JobForm from "@/components/admin/JobForm";
import type { IClient } from "@/types";

export const metadata: Metadata = { title: "New Job" };

async function getClients(): Promise<IClient[]> {
  await connectDB();
  const clients = await Client.find().select("name").sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(clients));
}

export default async function NewJobPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">New Job</h1>
      <JobForm clients={clients} />
    </div>
  );
}
