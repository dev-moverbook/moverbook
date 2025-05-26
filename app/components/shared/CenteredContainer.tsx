import { cn } from "@/lib/utils"; // assuming you're using a utility like Tailwind's `clsx`

interface CenteredContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn("flex flex-col max-w-2xl mx-auto px-4 md:px-2", className)}
    >
      {children}
    </div>
  );
};

export default CenteredContainer;
