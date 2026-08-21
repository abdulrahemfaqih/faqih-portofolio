"use client";

/**
 * Form kontak via EmailJS — sesuai PRD asumsi #8
 * State loading jelas, feedback via react-hot-toast
 * Pesan tidak disimpan ke database
 */

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { PaperPlaneTilt } from "@phosphor-icons/react";

type FormState = "idle" | "loading" | "success";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );
      toast.success("Pesan berhasil terkirim! Saya akan segera membalas.");
      formRef.current?.reset();
      setState("success");
    } catch (error) {
      console.error("[ContactForm] EmailJS error:", error);
      toast.error("Gagal mengirim pesan. Coba lagi atau hubungi lewat email langsung.");
      setState("idle");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-name"
            className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
          >
            Nama
          </label>
          <input
            id="contact-name"
            name="from_name"
            type="text"
            required
            placeholder="Nama Anda"
            className="
              px-3 py-2.5 rounded-sm
              border border-[--ink-12] bg-transparent
              text-body text-[--ink]
              placeholder:text-[--ink-45]
              focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
              transition-colors duration-200
              hover:border-[--ink-45]
            "
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-email"
            className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="reply_to"
            type="email"
            required
            placeholder="email@anda.com"
            className="
              px-3 py-2.5 rounded-sm
              border border-[--ink-12] bg-transparent
              text-body text-[--ink]
              placeholder:text-[--ink-45]
              focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
              transition-colors duration-200
              hover:border-[--ink-45]
            "
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
        >
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Ceritakan proyek atau kebutuhan Anda..."
          className="
            px-3 py-2.5 rounded-sm resize-y
            border border-[--ink-12] bg-transparent
            text-body text-[--ink]
            placeholder:text-[--ink-45]
            focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
            transition-colors duration-200
            hover:border-[--ink-45]
          "
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-solid self-start disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? (
          <>
            <span
              className="inline-block w-3.5 h-3.5 border-2 border-[--paper] border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            Mengirim...
          </>
        ) : (
          <>
            <PaperPlaneTilt size={15} weight="bold" />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
