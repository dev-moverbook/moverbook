import React from "react";
import { cn } from "@/lib/utils";
interface ContainerUserCardProps {
  children: React.ReactNode;
  className?: string;
}

const ContainerUserCard: React.FC<ContainerUserCardProps> = ({
  children,
  className,
}) => {
  return <div className={cn("", className)}>{children}</div>;
};

export default ContainerUserCard;
