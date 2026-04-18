import { z } from "zod";

// ─── Job ──────────────────────────────────────────────────────────────────────

export const JobSchema = z.object({
  title: z.string().min(1, "Job title is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  location: z.string().trim().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"], {
    error: "Invalid job type",
  }),
  applyInfo: z
    .string()
    .min(1, "How to apply info is required")
    .trim(),
  isVisible: z.boolean().default(true),
  clientId: z.string().min(1, "Client is required"),
});

export const JobUpdateSchema = JobSchema.partial();

export type JobInput = z.infer<typeof JobSchema>;
export type JobUpdateInput = z.infer<typeof JobUpdateSchema>;

// ─── Client ───────────────────────────────────────────────────────────────────

export const ClientSchema = z.object({
  name: z.string().min(1, "Company name is required").trim(),
  industry: z.string().trim().optional(),
  contactPerson: z.string().trim().optional(),
  contactEmail: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),
  contactPhone: z.string().trim().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  logoPublicId: z.string().optional(),
  notes: z.string().trim().optional(),
});

export const ClientUpdateSchema = ClientSchema.partial();

export type ClientInput = z.infer<typeof ClientSchema>;
export type ClientUpdateInput = z.infer<typeof ClientUpdateSchema>;

// ─── Employee ─────────────────────────────────────────────────────────────────

export const EmployeeBaseSchema = z.object({
  name: z.string().min(1, "Full name is required").trim(),
  role: z.string().min(1, "Role/job title is required").trim(),
  clientId: z.string().min(1, "Client is required"),
  startDate: z.string().min(1, "Start date is required"),
  status: z.enum(["ACTIVE", "ON_LEAVE", "ENDED"], {
    error: "Invalid status",
  }),
  phone: z.string().trim().optional(),
  email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  photoPublicId: z.string().optional(),
});

/**
 * Financial fields — these are validated as part of the schema but the API
 * enforces that only SUPER_ADMIN requests can write them.
 */
export const FinancialSchema = z.object({
  salary: z.number().nonnegative().optional(),
  farFee: z.number().nonnegative().optional(),
  bankName: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  accountName: z.string().trim().optional(),
});

export const EmployeeSchema = EmployeeBaseSchema.merge(FinancialSchema);
export const EmployeeUpdateSchema = EmployeeSchema.partial();

export type EmployeeInput = z.infer<typeof EmployeeSchema>;
export type EmployeeUpdateInput = z.infer<typeof EmployeeUpdateSchema>;

// ─── The financial field keys — used server-side to strip them from STAFF requests ──

export const FINANCIAL_FIELDS = [
  "salary",
  "farFee",
  "bankName",
  "accountNumber",
  "accountName",
] as const;

export type FinancialFieldKey = (typeof FINANCIAL_FIELDS)[number];
