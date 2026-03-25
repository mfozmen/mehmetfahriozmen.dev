"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";

const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#BA7517]/[0.15] bg-[#BA7517]/[0.02] px-4 py-3 text-[15px] text-neutral-200 placeholder:text-neutral-600 transition-colors focus:border-[#BA7517]/40 focus:outline-none focus:ring-1 focus:ring-[#BA7517]/30";

const labelClass = "font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400";

function FieldError({ message }: Readonly<{ message: string }>) {
  return <p className="mt-1.5 text-[12px] text-red-400" role="alert">{message}</p>;
}

function RequiredMark() {
  return <span className="ml-1 text-[#BA7517]/60" aria-hidden="true">*</span>;
}

function SuccessMessage({ onReset }: Readonly<{ onReset: () => void }>) {
  return (
    <div className="rounded-lg border border-[#BA7517]/20 bg-[#BA7517]/[0.04] px-6 py-10 text-center">
      <p className="text-lg font-semibold text-white">Transmission received.</p>
      <p className="mt-2 text-[14px] text-neutral-400">
        I&apos;ll get back to you as soon as I can.
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="cursor-pointer font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]"
        >
          Send another message
        </button>
        <span className="text-neutral-700">&middot;</span>
        <Link href="/" className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-[#BA7517]">
          Back to home &rarr;
        </Link>
      </div>
    </div>
  );
}

function FormFields({ errors }: Readonly<{ errors: Record<string, string> }>) {
  return (
    <>
      <div>
        <label htmlFor="name" className={labelClass}>Name<RequiredMark /></label>
        <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} placeholder="Your name" />
        {errors.name && <FieldError message={errors.name} />}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email<RequiredMark /></label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" />
        {errors.email && <FieldError message={errors.email} />}
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>Message<RequiredMark /></label>
        <textarea id="message" name="message" rows={5} required className={`${inputClass} resize-none`} placeholder="What's on your mind?" />
        {errors.message && <FieldError message={errors.message} />}
      </div>
    </>
  );
}

function validate(form: FormData): Record<string, string> {
  const errs: Record<string, string> = {};
  const name = (form.get("name") as string).trim();
  const email = (form.get("email") as string).trim();
  const message = (form.get("message") as string).trim();
  if (!name) errs.name = "Name is required.";
  if (!email) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
  if (!message) errs.message = "Message is required.";
  return errs;
}

const FIELD_ORDER = ["name", "email", "message"];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstError = FIELD_ORDER.find((f) => errs[f]);
      if (firstError) document.getElementById(firstError)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, { method: "POST", body: form, headers: { Accept: "application/json" } });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <SuccessMessage onReset={() => { setStatus("idle"); setErrors({}); }} />;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormFields errors={errors} />
      {status === "error" && (
        <p className="text-[13px] text-red-400" role="alert">
          Something went wrong. Please try again or email directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer rounded-lg border border-[#BA7517]/40 bg-[#BA7517]/[0.06] px-6 py-3 font-mono text-[12px] uppercase tracking-[0.15em] text-[#BA7517] transition-colors hover:border-[#BA7517]/60 hover:bg-[#BA7517]/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Transmit"}
      </button>
    </form>
  );
}
