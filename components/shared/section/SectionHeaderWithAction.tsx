import { cn } from "@/lib/utils";

interface SectionHeaderWithActionProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

const SectionHeaderWithAction: React.FC<SectionHeaderWithActionProps> = ({
  title,
  action,
  className,
}) => {
  return (
    <div className="px-4 md:px-0 my-4">
      <div className="flex items-center justify-between max-w-screen-sm mx-auto">
        <h2 className={cn("text-2xl font-medium", className)}>{title}</h2>{" "}
        {action}
      </div>
    </div>
  );
};

export default SectionHeaderWithAction;
