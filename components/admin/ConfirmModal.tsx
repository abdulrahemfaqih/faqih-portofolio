"use client";

import { Warning } from "@phosphor-icons/react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[--ink]/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md card bg-[--paper] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start gap-4">
          {isDangerous && (
            <div className="p-2.5 rounded-sm bg-red-50 text-red-600 border border-red-200 shrink-0">
              <Warning size={22} weight="fill" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3
              id="modal-title"
              className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink]"
            >
              {title}
            </h3>
            <p className="mt-2 text-small text-[--ink-70] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[--ink-12]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-outline text-xs px-4 py-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-xs px-4 py-2 rounded-sm transition-colors duration-200 font-medium ${
              isDangerous
                ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                : "btn-solid"
            }`}
          >
            {isLoading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
