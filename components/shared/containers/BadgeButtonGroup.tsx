import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeButtonGroupProps {
  children: ReactNode;
  className?: string;
}

const BadgeButtonGroup = ({ children, className }: BadgeButtonGroupProps) => {
  return (
    <div
      className={cn("flex flex-wrap gap-2 mt-2 w-full px-4 md:px-0", className)}
    >
      {children}
    </div>
  );
};

export default BadgeButtonGroup;
