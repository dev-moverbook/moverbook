"use client";

import React from "react";
import { Option } from "@/types/types";
import AdaptiveSelectOptionsList from "./AdaptiveSelectOptionsList";
import AdaptiveSelectTrigger from "./AdaptiveSelectTrigger";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface AdaptiveSelectDesktopProps {
  allIcon?: React.ReactNode;
  allValue?: string;
  className?: string;
  disabled?: boolean;
  emptyText?: string;
  onChange: (value: string) => void;
  open: boolean;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  selectedOption: Option | null;
  setOpen: (open: boolean) => void;
  showSearch?: boolean;
  title?: string;
  value: string | null;
}

export default function AdaptiveSelectDesktop({
  allIcon,
  allValue,
  className,
  disabled,
  emptyText,
  onChange,
  open,
  options,
  placeholder,
  searchPlaceholder,
  selectedOption,
  setOpen,
  showSearch = true,
  title,
  value,
}: AdaptiveSelectDesktopProps) {
  const handlePick = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <AdaptiveSelectTrigger
          allIcon={allIcon}
          allValue={allValue}
          className={className}
          disabled={disabled}
          onOpen={() => setOpen(true)}
          open={open}
          placeholder={placeholder}
          selectedOption={selectedOption}
          title={title}
        />
      </PopoverTrigger>
      <PopoverContent className="shadow-white/10 shadow-xl">
        <AdaptiveSelectOptionsList
          allIcon={allIcon}
          allValue={allValue}
          emptyText={emptyText}
          listMaxH="max-h-72"
          onPick={handlePick}
          options={options}
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          value={value}
        />
      </PopoverContent>
    </Popover>
  );
}
