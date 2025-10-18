"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CalendarContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("overflow-x-hidden w-full max-w-full", className)}>
      {children}
    </div>
  );
};

export default CalendarContainer;
