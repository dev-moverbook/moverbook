import { BadgeButton } from "./BadgeButton";
import { Doc } from "@/convex/_generated/dataModel";

interface VariableInsertButtonsProps {
  variables: Doc<"variables">[];
  onInsert: (variableName: string) => void;
  className?: string;
}

const VariableInsertButtons: React.FC<VariableInsertButtonsProps> = ({
  variables,
  onInsert,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2  ${className}`}>
      {variables.map((variable) => (
        <BadgeButton key={variable._id} onClick={() => onInsert(variable.name)}>
          {variable.name}
        </BadgeButton>
      ))}
    </div>
  );
};

export default VariableInsertButtons;
