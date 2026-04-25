"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatNaira, EMPLOYEE_STATUS_LABELS } from "@/lib/utils";
import type { IEmployee } from "@/types";

interface Props {
  employees: IEmployee[];
  isSuperAdmin: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ENDED: "bg-neutral-100 text-neutral-600",
  ON_LEAVE: "bg-yellow-100 text-yellow-700",
};

export default function EmployeesTable({ employees, isSuperAdmin }: Props) {
  const router = useRouter();
  const [list, setList] = useState(employees);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete employee "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete employee");
        return;
      }
      setList((l) => l.filter((e) => e._id !== id));
      toast.success("Employee deleted");
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
        <p className="text-neutral-500 mb-4">No employees yet.</p>
        <a href="/dashboard/employees/new" className="bg-brand-gradient rounded px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Add First Employee
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:hidden">
        {list.map((emp) => (
          <div key={emp._id} className="rounded bg-surface-lowest p-4">
            <div className="mb-3 flex items-center gap-3">
              {emp.photoUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-ghost">
                  <Image src={emp.photoUrl} alt={emp.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-500">
                  {emp.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-medium text-neutral-900">{emp.name}</h3>
                {emp.email && <p className="text-xs text-neutral-500">{emp.email}</p>}
              </div>
            </div>

            <div className="space-y-1 text-xs text-neutral-600">
              <p>Role: {emp.role}</p>
              <p>
                Status:{" "}
                <span className={`rounded px-2 py-0.5 font-medium uppercase tracking-wide ${STATUS_COLORS[emp.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                  {EMPLOYEE_STATUS_LABELS[emp.status] ?? emp.status}
                </span>
              </p>
              {isSuperAdmin && <p>Salary: {emp.salary != null ? formatNaira(emp.salary) : "-"}</p>}
              {isSuperAdmin && <p>FAR Fee: {emp.farFee != null ? formatNaira(emp.farFee) : "-"}</p>}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={`/dashboard/employees/${emp._id}/edit`}
                className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(emp._id, emp.name)}
                disabled={deleting === emp._id}
                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting === emp._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded bg-surface-lowest lg:block">
        <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Role / Department</th>
            <th className="px-4 py-3">Status</th>
            {isSuperAdmin && <th className="px-4 py-3">Salary</th>}
            {isSuperAdmin && <th className="px-4 py-3">FAR Fee</th>}
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {list.map((emp) => {
            return (
              <tr key={emp._id} className="odd:bg-surface-lowest even:bg-surface transition-colors hover:bg-surface">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {emp.photoUrl ? (
                      <div className="relative h-8 w-8 overflow-hidden rounded-full border-ghost">
                        <Image src={emp.photoUrl} alt={emp.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-500">
                        {emp.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-neutral-900">{emp.name}</div>
                      {emp.email && <div className="text-xs text-neutral-500">{emp.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-neutral-800">{emp.role}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${STATUS_COLORS[emp.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                    {EMPLOYEE_STATUS_LABELS[emp.status] ?? emp.status}
                  </span>
                </td>
                {isSuperAdmin && (
                  <td className="px-4 py-4 tabular-nums text-neutral-700">
                    {emp.salary != null ? formatNaira(emp.salary) : "—"}
                  </td>
                )}
                {isSuperAdmin && (
                  <td className="px-4 py-4 tabular-nums text-neutral-700">
                    {emp.farFee != null ? formatNaira(emp.farFee) : "—"}
                  </td>
                )}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/dashboard/employees/${emp._id}/edit`}
                      className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(emp._id, emp.name)}
                      disabled={deleting === emp._id}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === emp._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </>
  );
}
