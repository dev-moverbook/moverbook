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
  return <div className={cn("", className)}>{children}</div>;
};

export default CardContainer;
