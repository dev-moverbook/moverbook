"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  /** Scroll the input to the top of the viewport on focus (mobile only) */
  scrollOnFocus?: boolean;
  /** Max width (px) to consider as mobile */
  mobileBreakpoint?: number;
  /** Offset (px) from the very top when scrolling (e.g., fixed header height) */
  scrollOffset?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  debounceMs = 300,
  scrollOnFocus = true,
  mobileBreakpoint = 768,
  scrollOffset = 20,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange(internalValue);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [internalValue, onChange, debounceMs]);

  const handleFocus = () => {
    if (!scrollOnFocus || typeof window === "undefined") return;
    const isMobile = window.matchMedia(
      `(max-width: ${mobileBreakpoint}px)`
    ).matches;
    if (!isMobile) return;

    // small delay improves reliability on iOS when the keyboard opens
    setTimeout(() => {
      const el = wrapperRef.current;
      if (!el) return;
      const top =
        (window.pageYOffset || document.documentElement.scrollTop) +
        el.getBoundingClientRect().top -
        scrollOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 50);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <Input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="pr-10"
        inputMode="search"
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => setInternalValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
