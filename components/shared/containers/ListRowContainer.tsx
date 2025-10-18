import { cn } from "@/lib/utils";
import ListHeader from "../heading/ListHeader";

interface ListRowContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const ListRowContainer: React.FC<ListRowContainerProps> = ({
  children,
  className,
  title,
}) => {
  return (
    <div className={cn("max-w-screen-sm mx-auto mt-4 w-full", className)}>
      {title && <ListHeader>{title}</ListHeader>}
      {children}
    </div>
  );
};

export default ListRowContainer;
