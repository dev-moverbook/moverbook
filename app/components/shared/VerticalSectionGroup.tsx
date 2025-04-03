import React from "react";

interface VerticalSectionGroupProps {
  children: React.ReactNode;
  className?: string;
}

const VerticalSectionGroup: React.FC<VerticalSectionGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
};

export default VerticalSectionGroup;
