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
    <>
      <div className="space-y-4 lg:hidden">
        {list.map((client) => (
          <div key={client._id} className="rounded bg-surface-lowest p-4">
            <div className="mb-3 flex items-center gap-3">
              {client.logoUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded border-ghost">
                  <Image src={client.logoUrl} alt={client.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-brand-50 text-xs font-bold text-brand-500">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-medium text-neutral-900">{client.name}</h3>
                <p className="text-xs text-neutral-500">{client.industry ?? "-"}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600">Contact: {client.contactPerson ?? "-"}</p>

            <div className="mt-4 flex items-center gap-2">
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
                {deleting === client._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded bg-surface-lowest lg:block">
        <table className="min-w-[920px] whitespace-nowrap text-sm w-full">
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
            <tr key={client._id} className="odd:bg-surface-lowest even:bg-surface transition-colors hover:bg-surface">
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
    </>
  );
}
