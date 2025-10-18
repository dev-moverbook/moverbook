"use client";

import { CommandInput } from "@/components/ui/command";
import { X } from "lucide-react";

interface CommandSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CommandSearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: CommandSearchInputProps) {
  return (
    <div className="sticky top-1.5 z-10 bg-black rounded px-4 md:px-0">
      <div className="relative">
        <CommandInput
          placeholder={placeholder}
          autoFocus={false}
          value={value}
          onValueChange={onChange}
          className="pr-8 text-white placeholder:text-grayCustom2"
        />
        {value.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 focus:outline-none"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        )}
      </div>
    </div>
  );
}
