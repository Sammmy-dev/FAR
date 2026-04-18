import type { Metadata } from "next";
import ClientForm from "@/components/admin/ClientForm";

export const metadata: Metadata = { title: "New Client" };

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">New Client</h1>
      <ClientForm />
    </div>
  );
}
