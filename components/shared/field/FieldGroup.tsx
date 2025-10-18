import { cn } from "@/lib/utils";

interface FieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

const FieldGroup: React.FC<FieldGroupProps> = ({ children, className }) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

export default FieldGroup;
