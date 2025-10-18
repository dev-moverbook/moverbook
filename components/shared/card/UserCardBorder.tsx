import { cn } from "@/lib/utils";

interface UserCardBorderProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const UserCardBorder: React.FC<UserCardBorderProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "border-b border-grayCustom hover:bg-background2 hover:rounded-md p-4 cursor-pointer flex items-center justify-between",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default UserCardBorder;
