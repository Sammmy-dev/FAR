"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { HiViewGrid, HiBriefcase, HiOfficeBuilding, HiUsers, HiMenu, HiX, HiClipboardList } from "react-icons/hi";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface Props {
  role: UserRole;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: HiViewGrid },
  { label: "Jobs", href: "/dashboard/jobs", icon: HiBriefcase },
  { label: "Clients", href: "/dashboard/clients", icon: HiOfficeBuilding },
  { label: "Employees", href: "/dashboard/employees", icon: HiUsers },
  { label: "Assessments", href: "/dashboard/assessments", icon: HiClipboardList },
];

export default function AdminSidebar({ role }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2">
          <Image src="/FAR.png" alt="FAR" width={36} height={30} className="object-contain" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Admin</span>
        </div>
      </div>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-gradient text-white"
                : "text-neutral-700 hover:bg-surface-high hover:text-neutral-900"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
      <div className="mt-4 border-t border-neutral-200 pt-4 px-2">
        <span className="text-xs text-neutral-400">Role: {role}</span>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      {!open && (
        <button
          className="fixed top-3 left-3 z-50 rounded-lg bg-white p-2 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <HiMenu className="h-5 w-5 text-neutral-700" />
        </button>
      )}

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: slide-in */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-white transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex justify-end border-b border-neutral-200 p-3 lg:hidden">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1 text-neutral-700 hover:bg-surface"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
