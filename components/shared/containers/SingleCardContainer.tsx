import { cn } from "@/lib/utils";

interface SingleCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SingleCardContainer: React.FC<SingleCardContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex max-w-screen-sm flex-wrap gap-4", className)}>
      {children}
    </div>
  );
};

export default SingleCardContainer;
