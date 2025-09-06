"use client";

import { useState, type ReactNode } from "react";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  headerClassName?: string;
  lockedText?: string;
  locked?: boolean;
  showCheckmark?: boolean;
  isCompleted?: boolean;
  showAlert?: boolean;
  className?: string;
  toggleLabels?: { open: string; closed: string };
};

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  headerClassName,
  lockedText = "Locked until move day",
  locked = false,
  showCheckmark,
  isCompleted,
  showAlert,
  className,
  toggleLabels = { open: "Hide", closed: "Edit" },
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let actions: ReactNode;
  if (locked) {
    actions = <span className="text-grayCustom2">{lockedText}</span>;
  } else {
    actions = (
      <Button
        type="button"
        aria-expanded={isOpen}
        onClick={toggle}
        variant="link"
      >
        {isOpen ? toggleLabels.open : toggleLabels.closed}
      </Button>
    );
  }

  return (
    <section className={cn("border-grayCustom bg-black", className)}>
      <SectionHeader
        title={title}
        className={cn("mx-auto", headerClassName)}
        actions={actions}
        isCompleted={isCompleted}
        showCheckmark={showCheckmark}
        showAlert={showAlert}
        canEdit={false}
      />
      {isOpen && !locked && <div>{children}</div>}
    </section>
  );
}
