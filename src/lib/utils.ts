import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — resolves conflicts (e.g. p-2 vs p-4)
 * and deduplicates. Use everywhere instead of plain template literals.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object to a human-readable string.
 * Example: "12 Jan 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format a number as Nigerian Naira.
 * Example: 250000 → "₦250,000.00"
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert a job type enum value to a display label.
 */
export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

/**
 * Convert an employee status enum value to a display label.
 */
export const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  ENDED: "Ended",
};
