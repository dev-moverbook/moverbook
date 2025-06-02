import React from "react";
import IconRow from "./IconRow"; // adjust path as needed

interface CardHeaderWithActionsProps {
  title: React.ReactNode; // <-- changed from string
  actions?: React.ReactNode;
  className?: string;
}

const CardHeaderWithActions: React.FC<CardHeaderWithActionsProps> = ({
  title,
  actions,
  className = "",
}) => {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <h4 className="text-2xl font-medium">{title}</h4>
      <IconRow>{actions}</IconRow>
    </div>
  );
};

export default CardHeaderWithActions;
