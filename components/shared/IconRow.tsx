import { ReactNode } from "react";

interface IconRowProps {
  children: ReactNode;
  className?: string;
}

const IconRow: React.FC<IconRowProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {children}
    </div>
  );
};

export default IconRow;
