import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn("flex flex-col gap-4 max-w-screen-md mx-auto", className)}
    >
      {children}
    </div>
  );
};

export default PageContainer;
