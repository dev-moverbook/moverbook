import { useState } from "react";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import { VariableSchema } from "@/types/convex-schemas";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardContainer from "@/app/components/shared/CardContainer";
import FormActions from "@/app/components/shared/FormActions";
import { useUpdateVariable } from "../hooks/useUpdateVariable";
import VariableCard from "../components/VariableCard";

interface VariablesSectionProps {
  variables: VariableSchema[];
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
