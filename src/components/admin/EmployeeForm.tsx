"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import type { IEmployee, IClient } from "@/types";

interface Props {
  isSuperAdmin: boolean;
  clients: IClient[];
  employee?: IEmployee;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "ENDED", label: "Ended" },
];

export default function EmployeeForm({ isSuperAdmin, clients, employee }: Props) {
  const router = useRouter();
  const isEdit = !!employee;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
    role: employee?.role ?? "",
    startDate: employee?.startDate
      ? new Date(employee.startDate).toISOString().slice(0, 10)
      : "",
    status: employee?.status ?? "ACTIVE",
    clientId: typeof employee?.clientId === "object" ? employee.clientId._id : (employee?.clientId ?? ""),
    // financial fields
    salary: employee?.salary?.toString() ?? "",
    farFee: employee?.farFee?.toString() ?? "",
    bankName: employee?.bankName ?? "",
    accountNumber: employee?.accountNumber ?? "",
    accountName: employee?.accountName ?? "",
  });
  const [photoUrl, setPhotoUrl] = useState<string>(employee?.photoUrl ?? "");
  const [photoPublicId, setPhotoPublicId] = useState<string>(employee?.photoPublicId ?? "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5 MB");
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/upload?folder=employees", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Upload failed");
        return;
      }
      const data = await res.json();
      setPhotoUrl(data.url);
      setPhotoPublicId(data.publicId);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: Record<string, unknown> = {
      ...form,
      photoUrl,
      photoPublicId,
      salary: form.salary ? Number(form.salary) : undefined,
      farFee: form.farFee ? Number(form.farFee) : undefined,
    };

    // strip empty strings from optional fields
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") payload[k] = undefined;
    });

    const url = isEdit ? `/api/employees/${employee._id}` : "/api/employees";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save employee");
        return;
      }

      toast.success(isEdit ? "Employee updated" : "Employee created");
      router.push("/dashboard/employees");
      router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-brand-600 transition-colors placeholder:text-neutral-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded bg-surface-lowest p-8">
      <section>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Personal Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Full Name *</label>
            <input className={inputClass} required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Photo upload */}
      <section>
        <label className={labelClass}>Profile Photo</label>
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-200">
              <Image src={photoUrl} alt="Photo" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-neutral-300 text-neutral-400 text-xs">
              Photo
            </div>
          )}
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-surface disabled:opacity-60"
            >
              {uploading ? "Uploading…" : photoUrl ? "Change Photo" : "Upload Photo"}
            </button>
            <p className="mt-1 text-xs text-neutral-400">JPEG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Work Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Job Role / Title *</label>
            <input className={inputClass} required value={form.role} onChange={(e) => set("role", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Start Date *</label>
            <input className={inputClass} required type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Status *</label>
            <select className={inputClass} required value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Deployed To (Client) *</label>
            <select className={inputClass} required value={form.clientId} onChange={(e) => set("clientId", e.target.value)}>
              <option value="">Select a client…</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Financial Info — SUPER_ADMIN only */}
      {isSuperAdmin && (
        <section>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Financial Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Salary (₦)</label>
              <input className={inputClass} type="number" min="0" value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>FAR Fee (₦)</label>
              <input className={inputClass} type="number" min="0" value={form.farFee} onChange={(e) => set("farFee", e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>Bank Name</label>
              <input className={inputClass} value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Account Number</label>
              <input className={inputClass} value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} maxLength={10} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Account Name</label>
              <input className={inputClass} value={form.accountName} onChange={(e) => set("accountName", e.target.value)} />
            </div>
          </div>
        </section>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-brand-gradient rounded px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {loading ? "Saving…" : isEdit ? "Update Employee" : "Create Employee"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:bg-surface transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
