import React from "react";
import { cn } from "@/lib/utils"; // if you're using tailwind `cn` helper

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "p-4 border rounded shadow-xl shadow-white/10 w-full border-grayCustom",
        className
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;
