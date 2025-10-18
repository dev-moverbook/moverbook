import { cn } from "@/lib/utils";

type FilterRowProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FilterRow({ children, className }: FilterRowProps) {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>{children}</div>
  );
}
