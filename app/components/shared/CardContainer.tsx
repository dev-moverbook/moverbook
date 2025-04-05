import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className,
}) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

export default CardContainer;
