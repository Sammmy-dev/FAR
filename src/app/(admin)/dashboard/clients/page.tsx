import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import ClientsTable from "@/components/admin/ClientsTable";
import type { IClient } from "@/types";

export const metadata: Metadata = { title: "Manage Clients" };

async function getClients(): Promise<IClient[]> {
  await connectDB();
  const clients = await Client.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(clients));
}

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
        <Link
          href="/dashboard/clients/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          + New Client
        </Link>
      </div>
      <ClientsTable clients={clients} />
    </div>
  );
}
