import { cn } from "@/lib/utils";

interface CardDetailRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const CardDetailRow: React.FC<CardDetailRowProps> = ({
  label,
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full justify-between md:justify-normal text-base md:text-sm",
        className
      )}
    >
      <div className={cn("md:w-[30rem] font-medium", className)}>{label}</div>
      <div className={className}>{value}</div>
    </div>
  );
};

export default CardDetailRow;
