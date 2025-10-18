"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type SelectPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
};

export default function SelectPopover({
  open,
  onOpenChange,
  trigger,
  children,
  contentClassName,
}: SelectPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={
          contentClassName ?? "w-80 shadow-white/10 shadow-xl text-white"
        }
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
