"use client";

import { TEMPLATE_VARIABLES } from "@/types/const";
import { BadgeButton } from "./BadgeButton";

interface VariableInsertButtonsProps {
  onInsert: (variableName: string) => void;
  className?: string;
}

const VariableInsertButtons: React.FC<VariableInsertButtonsProps> = ({
  onInsert,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2  ${className}`}>
      {Object.values(TEMPLATE_VARIABLES).map((variable) => (
        <BadgeButton key={variable} onClick={() => onInsert(variable)}>
          {variable}
        </BadgeButton>
      ))}
    </div>
  );
};

export default VariableInsertButtons;
