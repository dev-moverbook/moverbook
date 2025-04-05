import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListItemRowProps {
  children: ReactNode;
  className?: string;
}

const ListItemRow: React.FC<ListItemRowProps> = ({ children, className }) => {
  return (
    <li
      className={cn("flex justify-between items-center space-x-4", className)}
    >
      {children}
    </li>
  );
};

export default ListItemRow;
