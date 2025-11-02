import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  showBorder?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
  showBorder = true,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 max-w-screen-sm w-full mx-auto px-4 md:px-1 py-4 overflow-x-hidden",
        showBorder && "border-b border-grayCustom sm:border-none",
        className
      )}
    >
      {children}
    </section>
  );
};

export default SectionContainer;
