import { Button } from "@/app/components/ui/button";
import { VariableSchema } from "@/types/convex-schemas";

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
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {variables.map((variable) => (
        <Button
          key={variable._id}
          variant="outline"
          size="sm"
          onClick={() => onInsert(variable.name)}
        >
          {variable.name}
        </Button>
      ))}
    </div>
  );
};

export default VariableInsertButtons;
