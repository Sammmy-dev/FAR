"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import type { IClient } from "@/types";

interface Props {
  clients: IClient[];
}

export default function ClientsTable({ clients }: Props) {
  const router = useRouter();
  const [list, setList] = useState(clients);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete client "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete client");
        return;
      }
      setList((l) => l.filter((c) => c._id !== id));
      toast.success("Client deleted");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(null);
    }
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded bg-surface-lowest py-16">
        <p className="text-neutral-500 mb-4">No clients yet.</p>
        <a href="/dashboard/clients/new" className="bg-brand-gradient rounded px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Add First Client
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded bg-surface-lowest">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
          <tr>
            <th className="px-4 py-3">Logo</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Industry</th>
            <th className="px-4 py-3">Contact Person</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {list.map((client) => (
            <tr key={client._id} className="transition-colors hover:bg-surface">
              <td className="px-4 py-4">
                {client.logoUrl ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded border-ghost">
                    <Image src={client.logoUrl} alt={client.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-brand-50 text-xs font-bold text-brand-500">
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="px-4 py-4 font-medium text-neutral-900">{client.name}</td>
              <td className="px-4 py-4 text-neutral-600">{client.industry ?? "—"}</td>
              <td className="px-4 py-4 text-neutral-600">{client.contactPerson ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/dashboard/clients/${client._id}/edit`}
                    className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(client._id, client.name)}
                    disabled={deleting === client._id}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting === client._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
