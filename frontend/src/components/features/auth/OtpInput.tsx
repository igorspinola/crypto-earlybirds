"use client";

import { useRef, type ChangeEvent, type KeyboardEvent } from "react";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
};

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const setChar = (i: number, ch: string) => {
    const arr = chars.slice();
    arr[i] = ch;
    onChange(arr.join(""));
  };

  const handleChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setChar(i, "");
      return;
    }
    if (raw.length === 1) {
      setChar(i, raw);
      refs.current[i + 1]?.focus();
      return;
    }
    const arr = chars.slice();
    for (let k = 0; k < raw.length && i + k < length; k++) {
      arr[i + k] = raw[k];
    }
    onChange(arr.join(""));
    const nextIdx = Math.min(i + raw.length, length - 1);
    refs.current[nextIdx]?.focus();
  };

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 md:gap-3">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={c}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          className={`h-14 w-14 rounded-xl border bg-white text-center font-display text-2xl font-bold text-foreground outline-none transition-colors focus:border-brand-blue-light md:h-16 md:w-16 md:text-3xl ${
            c ? "border-brand-blue-light" : "border-zinc-300"
          }`}
        />
      ))}
    </div>
  );
}
