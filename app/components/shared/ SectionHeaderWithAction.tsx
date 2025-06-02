import React from "react";

interface SectionHeaderWithActionProps {
  title: string;
  action?: React.ReactNode;
}

const SectionHeaderWithAction: React.FC<SectionHeaderWithActionProps> = ({
  title,
  action,
}) => {
  return (
    <div className="px-4 md:px-0 my-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium">{title}</h2>
        {action}
      </div>
    </div>
  );
};

export default SectionHeaderWithAction;
