"use client";

import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Option } from "@/types/types";
import LeadingMedia from "./LeadingMedia";

interface CommandListItemProps {
  option: Option & { image?: string; altText?: string };
  isSelected: boolean;
  isAll: boolean;
  allIcon?: React.ReactNode;
  onSelect: (value: string | null) => void;
}

export default function CommandListItem({
  option,
  isSelected,
  isAll,
  allIcon,
  onSelect,
}: CommandListItemProps) {
  const hasLeadingMedia = Boolean(option.image) || (isAll && Boolean(allIcon));
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
      {hasLeadingMedia && (
        <LeadingMedia
          isAll={isAll}
          allIcon={allIcon}
          image={option.image}
          altText={option.altText ?? option.label}
        />
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
