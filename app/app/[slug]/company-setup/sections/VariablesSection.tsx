import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import VariableCard from "../components/VariableCard";
import { Button } from "@/app/components/ui/button";
import { VariableSchema } from "@/types/convex-schemas";
import SectionHeader from "@/app/components/shared/SectionHeader";

interface VariablesSectionProps {
  variables: VariableSchema[]; // Replace `any` with actual type
  setIsVariableModalOpen: (isOpen: boolean) => void;
}

const VariablesSection: React.FC<VariablesSectionProps> = ({
  variables,
  setIsVariableModalOpen,
}) => {
  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Variables"
          actions={
            <Button onClick={() => setIsVariableModalOpen(true)}>
              + Create Variable
            </Button>
          }
        />

        {variables.length === 0 ? (
          <p className="text-gray-500">No active variables found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variables.map((variable) => (
              <VariableCard key={variable._id} variable={variable} />
            ))}
          </div>
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default VariablesSection;
