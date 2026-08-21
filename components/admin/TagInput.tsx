"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "@phosphor-icons/react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export default function TagInput({
  value = [],
  onChange,
  label = "Tags",
  placeholder = "Ketik lalu tekan Enter...",
  helperText = "Tekan Enter atau Koma untuk menambahkan",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  function addTag() {
    const trimmed = inputValue.trim().replace(/^,|,$/g, "");
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.06em] uppercase text-[--ink-70]">
          {label}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2 p-2 border border-[--ink-12] rounded-sm bg-transparent focus-within:border-[--ink] transition-colors">
        {value.map((tag, index) => (
          <span
            key={index}
            className="chip flex items-center gap-1 bg-[--surface-alt] text-[--ink] py-1 px-2 text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-[--ink-45] hover:text-[--ink] p-0.5 rounded-xs"
              aria-label={`Hapus tag ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] bg-transparent text-sm text-[--ink] outline-none placeholder:text-[--ink-45]"
        />
      </div>

      {helperText && (
        <span className="text-[0.6875rem] text-[--ink-45]">{helperText}</span>
      )}
    </div>
  );
}
