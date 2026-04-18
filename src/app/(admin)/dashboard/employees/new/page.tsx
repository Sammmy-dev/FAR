import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import EmployeeForm from "@/components/admin/EmployeeForm";
import type { IClient } from "@/types";

export const metadata: Metadata = { title: "New Employee" };

async function getClients(): Promise<IClient[]> {
  await connectDB();
  const clients = await Client.find().select("name").sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(clients));
}

export default async function NewEmployeePage() {
  const [session, clients] = await Promise.all([auth(), getClients()]);
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        New Employee
      </h1>
      <EmployeeForm clients={clients} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
