"use client";

import React, { useState } from "react";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Option } from "@/types/types";
import { CommandSearchInput } from "./CommandSearchInput";
import CommandListItem from "./CommandListItem";

export interface AdaptiveSelectOptionsListProps {
  allIcon?: React.ReactNode;
  allValue?: string;
  emptyText?: string;
  listMaxH?: string;
  onPick: (value: string | null) => void;
  options: Option[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  value?: string | null;
  id?: string;
}

export default function AdaptiveSelectOptionsList({
  allIcon,
  allValue = "__ALL__",
  emptyText = "No results found.",
  listMaxH,
  onPick,
  options,
  searchPlaceholder = "Search…",
  showSearch = true,
  value,
  id,
}: AdaptiveSelectOptionsListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <Command
      shouldFilter={showSearch}
      className={cn(
        "bg-black text-white",
        "[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-2",
        "[&_[cmdk-group-heading]]:font-medium",
        "[&_[cmdk-group-heading]]:text-white/60"
      )}
    >
      {showSearch && (
        <CommandSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
        />
      )}

      <CommandList
        style={{ overflowAnchor: "none" }}
        className={cn(listMaxH, "bg-black", showSearch && "mt-2")}
        id={id}
      >
        <CommandEmpty className="px-4 md:px-0 mt-2 text-white/70">
          {emptyText}
        </CommandEmpty>

        <CommandGroup className="mt-2">
          {options.map((option) => {
            const isSelected = value === option.value;
            const isAll = option.value === allValue && !!allIcon;
            return (
              <CommandListItem
                key={option.value}
                allIcon={allIcon}
                isAll={isAll}
                isSelected={isSelected}
                onSelect={onPick}
                option={option}
              />
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
