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

export type ApplyMethod = "WHATSAPP" | "EMAIL";

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
  qualification?: string;
  applyInfo: ApplyMethod;
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

export interface IAssessmentQuestion {
  type: "MCQ" | "OPEN_ENDED";
  prompt: string;
  options?: [string, string, string, string];
  correctIndex?: number;
  expectedAnswer?: string;
}

export interface IAssessment {
  _id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  isActive: boolean;
  questions: IAssessmentQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssessmentPublicQuestion {
  type: "MCQ" | "OPEN_ENDED";
  prompt: string;
  options?: [string, string, string, string];
}

export interface IAssessmentPublic {
  _id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  isActive: boolean;
  questions: IAssessmentPublicQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface IAssessmentAttempt {
  _id: string;
  assessmentId: string;
  candidateName: string;
  candidateEmail?: string;
  responses: {
    questionPrompt: string;
    questionType: "MCQ" | "OPEN_ENDED";
    selectedIndex?: number;
    selectedOption?: string;
    typedAnswer?: string;
    correctIndex?: number;
    correctOption?: string;
    expectedAnswer?: string;
    isCorrect?: boolean;
  }[];
  // Legacy field for old submissions
  answers: number[];
  score: number;
  total: number;
  submittedAt: string;
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
