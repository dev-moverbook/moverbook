import { Button } from "@/app/components/ui/button";
import { VariableSchema } from "@/types/convex-schemas";
import { BadgeButton } from "./buttons/BadgeButton";

interface VariableInsertButtonsProps {
  variables: VariableSchema[];
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
