"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const endpoint = useMemo(() => "/api/contacts", []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current ?? event.currentTarget;
    setState("submitting");
    setErrorMessage(null);

    const formData = new FormData(form);
    const rawPhone = String(formData.get("phone") ?? "").trim();
    const rawCompany = String(formData.get("company") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: rawPhone || null,
      company: rawCompany || null,
      message: String(formData.get("message") ?? "").trim(),
      source: "website-contact",
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const detail = Array.isArray(errBody?.detail)
          ? errBody.detail
            .map((d: { msg?: string; loc?: unknown[] }) => d.msg)
            .filter(Boolean)
            .join(". ")
          : errBody?.message ?? errBody?.detail;
        throw new Error(
          detail || `Contact submission failed (${response.status})`,
        );
      }
      setState("success");
      form?.reset();
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit right now. Please try again.",
      );
    }
  };

  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      <Input name="name" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Work email" required />
      <Input name="phone" placeholder="Phone number" />
      <Input name="company" placeholder="Company" />
      <textarea
        name="message"
        required
        minLength={10}
        placeholder="Tell us your BFSI or compliance workflow goals (min 10 characters)"
        className="min-h-32 w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-body text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] focus-visible:border-[var(--audit-green)] focus-visible:ring-2 focus-visible:ring-[var(--audit-green)]/25 focus-visible:outline-none"
      />
      <div className="flex items-center justify-between gap-3">
        <Button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Submitting..." : "Submit Lead"}
        </Button>
        {state === "success" && (
          <span className="text-body text-audit">Submitted successfully.</span>
        )}
        {state === "error" && (
          <span className="text-body text-[var(--warning-amber)]">
            {errorMessage}
          </span>
        )}
      </div>
    </form>
  );
}
