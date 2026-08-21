"use client";

import { useState } from "react";
import { Plus, Trash, DotsSixVertical } from "@phosphor-icons/react";

interface BulletPointsInputProps {
  value: string[];
  onChange: (points: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function BulletPointsInput({
  value = [],
  onChange,
  label = "Poin-poin Deskripsi Pekerjaan",
  placeholder = "Contoh: Mengembangkan fitur autentikasi dan payment gateway...",
}: BulletPointsInputProps) {
  const [newPoint, setNewPoint] = useState("");

  function handleAdd() {
    const trimmed = newPoint.trim();
    if (trimmed) {
      onChange([...value, trimmed]);
      setNewPoint("");
    }
  }

  function handleUpdate(index: number, text: string) {
    const updated = [...value];
    updated[index] = text;
    onChange(updated);
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
          {label}
        </label>
      )}

      {/* List poin yang sudah ada */}
      <div className="space-y-2">
        {value.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-3 w-1.5 h-1.5 rounded-full bg-[--ink-45] shrink-0" />
            <textarea
              rows={2}
              value={point}
              onChange={(e) => handleUpdate(index, e.target.value)}
              className="
                flex-1 px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink]
                focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
                resize-y
              "
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-red-600 hover:text-red-700 transition-colors shrink-0"
              aria-label={`Hapus poin ${index + 1}`}
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Input poin baru */}
      <div className="flex gap-2 mt-1">
        <textarea
          rows={2}
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="
            flex-1 px-3 py-2 text-sm rounded-sm border border-[--ink-12] bg-transparent text-[--ink]
            placeholder:text-[--ink-45]
            focus-visible:outline-2 focus-visible:outline-[--ink] focus-visible:outline-offset-2
            resize-y
          "
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newPoint.trim()}
          className="btn-outline text-xs px-3 py-2 shrink-0 self-end disabled:opacity-40"
        >
          <Plus size={14} weight="bold" />
          Tambah Poin
        </button>
      </div>
      <p className="text-[0.6875rem] text-[--ink-45]">
        Tekan Enter untuk menambahkan poin baru ke dalam daftar
      </p>
    </div>
  );
}
