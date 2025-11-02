import { cn } from "@/lib/utils";

interface AdaptiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  className = "",
}) => {
  return <div className={cn("flex flex-col gap-0", className)}>{children}</div>;
};

export default AdaptiveContainer;
