"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  debounceMs = 300,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, onChange, debounceMs]);

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => setInternalValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
