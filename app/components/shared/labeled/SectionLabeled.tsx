import React from "react";

interface SectionLabeledProps {
  children: React.ReactNode;
  className?: string;
}

const SectionLabeled: React.FC<SectionLabeledProps> = ({
  children,
  className = "",
}) => {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
};

export default SectionLabeled;
