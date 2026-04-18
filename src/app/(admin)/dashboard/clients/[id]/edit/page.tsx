import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import ClientForm from "@/components/admin/ClientForm";
import type { IClient } from "@/types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: "Edit Client" };

async function getClient(id: string): Promise<IClient | null> {
  await connectDB();
  const client = await Client.findById(id).lean();
  return client ? (JSON.parse(JSON.stringify(client)) as IClient) : null;
}

export default async function EditClientPage({ params }: Props) {
  const client = await getClient(params.id);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit Client</h1>
      <ClientForm client={client} />
    </div>
  );
}
