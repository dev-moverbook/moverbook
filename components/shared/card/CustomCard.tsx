import { cn } from "@/lib/utils";

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-0 border rounded shadow-xl shadow-white/10 w-full border-grayCustom overflow-hidden",
        className,
        onClick && "cursor-pointer"
      )}
    >
      {children}
    </div>
  );
};
export default CustomCard;
