import type { DefaultSession } from "next-auth";

// ─── NextAuth augmentation ────────────────────────────────────────────────────
declare module "next-auth" {
  interface User {
    role: "SUPER_ADMIN" | "STAFF";
  }
  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "STAFF";
    } & DefaultSession["user"];
  }
}

// next-auth v5 beta JWT augmentation

// ─── Shared app types ─────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "STAFF";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "ENDED";

// Plain-object shapes returned from API / server components (no Mongoose docs)
export interface IClient {
  _id: string;
  name: string;
  industry?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  logoPublicId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IJob {
  _id: string;
  title: string;
  description: string;
  location?: string;
  type: JobType;
  applyInfo: string;
  isVisible: boolean;
  clientId: string | IClient;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployee {
  _id: string;
  name: string;
  role: string;
  clientId: string | IClient;
  startDate: string;
  status: EmployeeStatus;
  phone?: string;
  email?: string;
  photoUrl?: string;
  photoPublicId?: string;
  // Financial — only present when requested by SUPER_ADMIN
  salary?: number;
  farFee?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats shape
export interface DashboardStats {
  totalClients: number;
  totalJobs: number;
  activeJobs: number;
  totalEmployees: number;
  activeEmployees: number;
}
