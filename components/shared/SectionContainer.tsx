import { cn } from "@/lib/utils";

const SectionContainer = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => {
  return (
    <div
      className={cn(
        "shadow-sm space-y-4 ",
        isLast ? "pb-20" : "border-b md:border-b-0 border-grayCustom pb-8"
      )}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
