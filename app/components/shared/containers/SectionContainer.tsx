import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 max-w-screen-sm w-full mx-auto px-3 md:px-0 pb-8",
        className
      )}
    >
      {children}
    </section>
  );
};

export default SectionContainer;
