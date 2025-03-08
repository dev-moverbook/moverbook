import VariableCard from "../components/VariableCard";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { VariableSchema } from "@/types/convex-schemas";

interface VariablesSectionProps {
  variables: VariableSchema[]; // Replace `any` with actual type
  setIsVariableModalOpen: (isOpen: boolean) => void;
}

const VariablesSection: React.FC<VariablesSectionProps> = ({
  variables,
  setIsVariableModalOpen,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Variables</h2>
        <Button onClick={() => setIsVariableModalOpen(true)}>
          + Create Variable
        </Button>
      </div>

      {variables.length === 0 ? (
        <p className="text-gray-500">No active variables found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variables.map((variable) => (
            <VariableCard key={variable._id} variable={variable} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VariablesSection;
