import React from "react";

interface EmptyListProps {
  message: string;
  className?: string;
}

const EmptyList: React.FC<EmptyListProps> = ({
  message = "No items added.",
  className = "",
}) => {
  return (
    <div className={`flex   ${className}`}>
      <div className="text-grayCustom2 ">{message}</div>
    </div>
  );
};

export default EmptyList;
