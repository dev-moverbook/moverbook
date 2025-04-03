import React from "react";
import SectionTitle from "./SectionTitle";

interface SectionHeaderWithActionProps {
  title: string;
  action?: React.ReactNode;
}

const SectionHeaderWithAction: React.FC<SectionHeaderWithActionProps> = ({
  title,
  action,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <SectionTitle className="mb-0 mt-0">{title}</SectionTitle>
      {action}
    </div>
  );
};

export default SectionHeaderWithAction;
