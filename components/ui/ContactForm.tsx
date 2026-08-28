"use client";

/**
 * Form kontak via EmailJS — sesuai PRD asumsi #8
 * Validasi ketat nama, email, dan pesan
 * State loading jelas, feedback via react-hot-toast & inline alerts
 * Pesan tidak disimpan ke database
 */

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { PaperPlaneTilt, WarningCircle, CheckCircle } from "@phosphor-icons/react";

type FormState = "idle" | "loading" | "success";

interface FormValues {
  from_name: string;
  reply_to: string;
  message: string;
}

interface FormErrors {
  from_name?: string;
  reply_to?: string;
  message?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [values, setValues] = useState<FormValues>({
    from_name: "",
    reply_to: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    from_name: false,
    reply_to: false,
    message: false,
  });

  const validate = (fieldsToValidate: FormValues): FormErrors => {
    const newErrors: FormErrors = {};

    const name = fieldsToValidate.from_name.trim();
    if (!name) {
      newErrors.from_name = "Nama wajib diisi";
    } else if (name.length < 2) {
      newErrors.from_name = "Nama minimal 2 karakter";
    }

    const email = fieldsToValidate.reply_to.trim();
    if (!email) {
      newErrors.reply_to = "Email wajib diisi";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.reply_to = "Format email tidak valid (contoh: nama@domain.com)";
    }

    const message = fieldsToValidate.message.trim();
    if (!message) {
      newErrors.message = "Pesan wajib diisi";
    } else if (message.length < 10) {
      newErrors.message = "Pesan minimal 10 karakter";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    // Jika field sudah pernah disentuh/interaksi, validasi secara dinamis
    if (touched[name as keyof FormValues]) {
      const validationErrors = validate(newValues);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate(values);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name as keyof FormErrors],
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;

    // Tandai semua field sebagai touched agar error muncul
    setTouched({
      from_name: true,
      reply_to: true,
      message: true,
    });

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.from_name) {
        document.getElementById("contact-name")?.focus();
        toast.error(validationErrors.from_name);
      } else if (validationErrors.reply_to) {
        document.getElementById("contact-email")?.focus();
        toast.error(validationErrors.reply_to);
      } else if (validationErrors.message) {
        document.getElementById("contact-message")?.focus();
        toast.error(validationErrors.message);
      }
      return;
    }

    setState("loading");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );
      toast.success("Pesan berhasil terkirim! Saya akan segera membalas.");
      setValues({ from_name: "", reply_to: "", message: "" });
      setErrors({});
      setTouched({ from_name: false, reply_to: false, message: false });
      formRef.current?.reset();
      setState("success");
    } catch (error) {
      console.error("[ContactForm] EmailJS error:", error);
      toast.error("Gagal mengirim pesan. Coba lagi atau hubungi lewat email langsung.");
      setState("idle");
    }
  }

  const handleResetSuccess = () => {
    setState("idle");
    setValues({ from_name: "", reply_to: "", message: "" });
    setErrors({});
    setTouched({ from_name: false, reply_to: false, message: false });
  };

  if (state === "success") {
    return (
      <div className="border border-[--ink-12] bg-[--paper] p-6 rounded-sm flex flex-col items-start gap-4">
        <div className="flex items-center gap-2.5 text-emerald-600">
          <CheckCircle size={24} weight="fill" />
          <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[--ink]">
            Pesan Berhasil Terkirim!
          </h3>
        </div>
        <p className="text-body text-[--ink-70]">
          Terima kasih telah menghubungi saya. Pesan Anda telah terkirim dan saya akan segera membalasnya via email.
        </p>
        <button
          type="button"
          onClick={handleResetSuccess}
          className="btn-outline text-xs mt-2"
        >
          Kirim Pesan Lainnya
        </button>
      </div>
    );
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
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            name="from_name"
            type="text"
            value={values.from_name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.from_name && !!errors.from_name}
            aria-describedby={errors.from_name ? "contact-name-error" : undefined}
            placeholder="Nama Anda"
            className={`
              px-3 py-2.5 rounded-sm
              border bg-transparent
              text-body text-[--ink]
              placeholder:text-[--ink-45]
              focus-visible:outline-2 focus-visible:outline-offset-2
              transition-colors duration-200
              ${
                touched.from_name && errors.from_name
                  ? "border-red-500 focus-visible:outline-red-500 hover:border-red-500"
                  : "border-[--ink-12] focus-visible:outline-[--ink] hover:border-[--ink-45]"
              }
            `}
          />
          {touched.from_name && errors.from_name && (
            <p
              id="contact-name-error"
              className="text-xs text-red-500 font-[family-name:var(--font-geist-mono)] flex items-center gap-1 mt-0.5"
              role="alert"
            >
              <WarningCircle size={13} weight="bold" className="shrink-0" />
              {errors.from_name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-email"
            className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="reply_to"
            type="email"
            value={values.reply_to}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.reply_to && !!errors.reply_to}
            aria-describedby={errors.reply_to ? "contact-email-error" : undefined}
            placeholder="email@anda.com"
            className={`
              px-3 py-2.5 rounded-sm
              border bg-transparent
              text-body text-[--ink]
              placeholder:text-[--ink-45]
              focus-visible:outline-2 focus-visible:outline-offset-2
              transition-colors duration-200
              ${
                touched.reply_to && errors.reply_to
                  ? "border-red-500 focus-visible:outline-red-500 hover:border-red-500"
                  : "border-[--ink-12] focus-visible:outline-[--ink] hover:border-[--ink-45]"
              }
            `}
          />
          {touched.reply_to && errors.reply_to && (
            <p
              id="contact-email-error"
              className="text-xs text-red-500 font-[family-name:var(--font-geist-mono)] flex items-center gap-1 mt-0.5"
              role="alert"
            >
              <WarningCircle size={13} weight="bold" className="shrink-0" />
              {errors.reply_to}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]"
        >
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={touched.message && !!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder="Ceritakan proyek atau kebutuhan Anda..."
          className={`
            px-3 py-2.5 rounded-sm resize-y
            border bg-transparent
            text-body text-[--ink]
            placeholder:text-[--ink-45]
            focus-visible:outline-2 focus-visible:outline-offset-2
            transition-colors duration-200
            ${
              touched.message && errors.message
                ? "border-red-500 focus-visible:outline-red-500 hover:border-red-500"
                : "border-[--ink-12] focus-visible:outline-[--ink] hover:border-[--ink-45]"
            }
          `}
        />
        {touched.message && errors.message && (
          <p
            id="contact-message-error"
            className="text-xs text-red-500 font-[family-name:var(--font-geist-mono)] flex items-center gap-1 mt-0.5"
            role="alert"
          >
            <WarningCircle size={13} weight="bold" className="shrink-0" />
            {errors.message}
          </p>
        )}
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
