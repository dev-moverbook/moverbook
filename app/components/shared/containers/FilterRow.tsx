import { cn } from "@/lib/utils";

type FilterRowProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FilterRow({ children, className }: FilterRowProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-2", className)}>
      {children}
    </div>
  );
}
