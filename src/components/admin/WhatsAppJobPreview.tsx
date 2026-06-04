"use client";

import { useMemo } from "react";
import type { IClient } from "@/types";

interface WhatsAppJobPreviewProps {
  title: string;
  client: IClient | null;
  location?: string;
  salary?: string;
  qualification?: string;
  requirements?: string;
  description?: string;
  applyInfo: "WHATSAPP" | "EMAIL";
}

export default function WhatsAppJobPreview({
  title,
  client,
  location,
  salary,
  qualification,
  requirements,
  description,
  applyInfo,
}: WhatsAppJobPreviewProps) {
  const formattedText = useMemo(() => {
    const lines: string[] = [];

    // Header
    lines.push("OUR CLIENT IS IN NEED OF:");
    lines.push("");

    // Position
    if (title) {
      lines.push(`Position: ${title}`);
    }

    // Location
    if (location) {
      lines.push(`Location: ${location}`);
    }

    // Salary
    if (salary) {
      lines.push(`Salary: ₦${Number(salary).toLocaleString()}`);
    }

    // Qualification
    if (qualification) {
      lines.push(`Qualification: ${qualification}`);
    }

    // Requirements
    if (requirements) {
      lines.push(`Requirements: ${requirements}`);
    }

    // Description
    if (description) {
      lines.push(`\nAbout the Role:\n${description}`);
    }

    // How to Apply
    lines.push("\nInterested candidates should apply as follows:");
    if (applyInfo === "WHATSAPP") {
      lines.push("Send your name, age, photo, address, qualification and the position you're applying for to FAR team on 07075727762 (WhatsApp)");
    } else {
      lines.push("Send your resume and cover letter to flavour.hr.airhis@gmail.com with the job title in the subject line");
    }

    return lines.join("\n");
  }, [title, client, location, salary, qualification, requirements, description, applyInfo]);

  // Check if there's enough content to preview
  const hasContent = title || client?.name || location || salary || qualification || requirements || description;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
        <p className="text-sm text-neutral-500">Fill in job details to see WhatsApp preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.444 0-2.846-.556-3.89-1.563-1.043-1.006-1.617-2.343-1.617-3.769 0-2.965 2.412-5.377 5.377-5.377 1.439 0 2.79.559 3.804 1.573 1.014 1.014 1.572 2.365 1.572 3.804 0 2.965-2.412 5.377-5.377 5.377m6.196-10.023c1.6 1.614 2.547 3.766 2.547 6.023 0 4.713-3.98 8.693-8.693 8.693-1.288 0-2.546-.29-3.728-.845L3.06 21.75l1.83-5.63c-.63-1.195-.99-2.55-.99-3.993C3.9 7.357 7.88 3.377 12.593 3.377c2.257 0 4.409.947 6.023 2.547" />
        </svg>
        <p className="text-sm font-semibold text-neutral-700">WhatsApp Preview</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5 font-sans text-sm leading-relaxed text-neutral-800 shadow-sm">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm">{formattedText}</pre>
      </div>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(formattedText);
          // Optionally show toast notification here
        }}
        className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
      >
        📋 Copy to clipboard
      </button>
    </div>
  );
}
