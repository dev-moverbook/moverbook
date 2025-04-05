import React from "react";
import { cn } from "@/lib/utils"; // optional if you're using `cn` helper

interface CardDetailsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const CardDetailsWrapper: React.FC<CardDetailsWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("mt-4 space-y-1 text-sm ", className)}>{children}</div>
  );
};

export default CardDetailsWrapper;
