"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

export default function AdminHeader({ user }: Props) {
  return (
    <header className="flex h-14 items-center justify-between bg-surface-lowest px-6 border-b border-neutral-100">
      <p className="text-sm font-medium text-neutral-700">
        Welcome, <span className="font-semibold text-brand-600">{user.name}</span>
      </p>
      <div className="flex items-center gap-4">
        <span className="rounded bg-brand-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
          {user.role}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-surface transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
