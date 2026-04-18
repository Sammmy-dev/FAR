"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import type { IClient } from "@/types";

interface Props {
  client?: IClient;
}

export default function ClientForm({ client }: Props) {
  const router = useRouter();
  const isEdit = !!client;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: client?.name ?? "",
    industry: client?.industry ?? "",
    contactPerson: client?.contactPerson ?? "",
    contactEmail: client?.contactEmail ?? "",
    contactPhone: client?.contactPhone ?? "",
    notes: client?.notes ?? "",
  });
  const [logoUrl, setLogoUrl] = useState<string>(client?.logoUrl ?? "");
  const [logoPublicId, setLogoPublicId] = useState<string>(client?.logoPublicId ?? "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/upload?folder=clients", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Upload failed");
        return;
      }
      const data = await res.json();
      setLogoUrl(data.url);
      setLogoPublicId(data.publicId);
      toast.success("Logo uploaded");
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/clients/${client._id}` : "/api/clients";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, logoUrl, logoPublicId }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save client");
        return;
      }

      toast.success(isEdit ? "Client updated" : "Client created");
      router.push("/dashboard/clients");
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
    <form onSubmit={handleSubmit} className="space-y-7 rounded bg-surface-lowest p-8">
      <div>
        <label className={labelClass}>Company Name *</label>
        <input className={inputClass} required value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Industry</label>
          <input className={inputClass} value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Technology, Finance" />
        </div>
        <div>
          <label className={labelClass}>Contact Person</label>
          <input className={inputClass} value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Contact Email</label>
          <input className={inputClass} type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Contact Phone</label>
          <input className={inputClass} type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Internal notes about this client…"
        />
      </div>

      {/* Logo upload */}
      <div>
        <label className={labelClass}>Company Logo</label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-100">
              <Image src={logoUrl} alt="Logo" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 text-xs">
              Logo
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
              {uploading ? "Uploading…" : logoUrl ? "Change Logo" : "Upload Logo"}
            </button>
            <p className="mt-1 text-xs text-neutral-400">JPEG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-brand-gradient rounded px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {loading ? "Saving…" : isEdit ? "Update Client" : "Create Client"}
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
