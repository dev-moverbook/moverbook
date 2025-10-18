import { cn } from "@/lib/utils";

interface Header4Props {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  button?: React.ReactNode;
}

const Header4: React.FC<Header4Props> = ({
  children,
  className,
  wrapperClassName,
  button,
}) => {
  return (
    <div className={cn("flex justify-between items-center", wrapperClassName)}>
      <h4 className={cn("text-white text-2xl font-medium", className)}>
        {children}
      </h4>
      {button}
    </div>
  );
};

export default Header4;
