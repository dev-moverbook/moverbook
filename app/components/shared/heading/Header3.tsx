import React from "react";
import { cn } from "@/lib/utils";

interface Header3Props {
  children: React.ReactNode;
  className?: string;
}

const Header3: React.FC<Header3Props> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-bold mb-2", className)}>{children}</h3>
  );
};

export default Header3;
