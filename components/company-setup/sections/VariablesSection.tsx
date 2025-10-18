import { useState } from "react";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import CardContainer from "@/components/shared/CardContainer";
import FormActions from "@/components/shared/FormActions";
import { useUpdateVariable } from "@/hooks/variables";
import { Doc } from "@/convex/_generated/dataModel";
import VariableCard from "@/components/company-setup/components/VariableCard";

interface VariablesSectionProps {
  variables: Doc<"variables">[];
}

const VariablesSection: React.FC<VariablesSectionProps> = ({ variables }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [editedValues, setEditedValues] = useState<Record<string, string>>(
    Object.fromEntries(variables.map((v) => [v._id, v.defaultValue]))
  );

  const handleValueChange = (id: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [id]: value }));
  };

  const { updateVariable, updateLoading, updateError, setUpdateError } =
    useUpdateVariable();

  const handleSave = async () => {
    const updates = variables.map(async (variable) => {
      const editedValue = editedValues[variable._id];
      if (editedValue !== variable.defaultValue) {
        return updateVariable(variable._id, { defaultValue: editedValue });
      }
    });

    await Promise.all(updates);
    setIsEditing(false);
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader
          className="px-0 pb-4"
          title="Variables"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancelEdit}
        />
        {isEditing && (
          <p className="text-sm text-grayCustom2 -mt-4 mb-2">
            Edit the default values for the variables below.
          </p>
        )}
        <CardContainer>
          {variables.map((variable) => (
            <VariableCard
              key={variable._id}
              variable={variable}
              value={editedValues[variable._id] ?? ""}
              onChange={handleValueChange}
              isEditing={isEditing}
            />
          ))}
        </CardContainer>
        {isEditing && (
          <div className="pt-4">
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={() => {
                setIsEditing(false);
                setUpdateError(null);
              }}
              isSaving={updateLoading}
              error={updateError}
            />
          </div>
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default VariablesSection;
