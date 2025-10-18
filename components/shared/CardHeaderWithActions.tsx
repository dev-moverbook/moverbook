import React from "react";
import IconRow from "./IconRow"; // adjust path as needed
import { cn } from "@/lib/utils";

interface CardHeaderWithActionsProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const CardHeaderWithActions: React.FC<CardHeaderWithActionsProps> = ({
  title,
  actions,
  className,
}) => {
  return (
    <div
      className={cn("py-4 px-4 flex justify-between items-start", className)}
    >
      <h4 className="text-2xl font-medium">{title}</h4>
      <IconRow>{actions}</IconRow>
    </div>
  );
};

export default CardHeaderWithActions;
