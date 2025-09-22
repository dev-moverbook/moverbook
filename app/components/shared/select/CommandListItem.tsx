"use client";

import React from "react";
import Image from "next/image";
import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Option } from "@/types/types";

interface CommandListItemProps {
  option: Option & { image?: string; altText?: string };
  isSelected: boolean;
  isAll: boolean;
  allIcon?: React.ReactNode;
  onSelect: (value: string) => void;
}

export default function CommandListItem({
  option,
  isSelected,
  isAll,
  allIcon,
  onSelect,
}: CommandListItemProps) {
  return (
    <CommandItem
      value={option.label}
      onSelect={() => onSelect(option.value)}
      className={cn(
        "flex items-center gap-2 px-4 py-3",
        "aria-selected:bg-transparent aria-selected:text-inherit",
        "data-[selected=true]:bg-white/10 data-[highlighted=true]:bg-white/10",
        "data-[selected=true]:text-white data-[highlighted=true]:text-white",
        "min-w-[240px]"
      )}
    >
      {isAll ? (
        <span className="h-8 w-8 flex items-center justify-center flex-shrink-0">
          {allIcon}
        </span>
      ) : option.image ? (
        <div className="relative h-8 w-8 flex-shrink-0">
          <Image
            src={option.image}
            alt={option.altText ?? option.label}
            fill
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        <span className="h-8 w-8 flex-shrink-0" />
      )}
      <span className={cn("truncate flex-1", isSelected && "font-bold")}>
        {option.label}
      </span>
      <Check
        className={cn(
          "h-6 w-6 ml-auto text-white",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}
