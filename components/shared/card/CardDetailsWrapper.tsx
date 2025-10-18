import { cn } from "@/lib/utils";

interface CardDetailsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const CardDetailsWrapper: React.FC<CardDetailsWrapperProps> = ({
  children,
  className,
}) => {
  return <div className={cn("text-sm  ", className)}>{children}</div>;
};

export default CardDetailsWrapper;
