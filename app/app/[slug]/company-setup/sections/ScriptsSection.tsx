"use client";

import ScriptCard from "../components/ScriptCard";
import { ScriptSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardContainer from "@/app/components/shared/CardContainer";
import AddItemButton from "@/app/components/shared/buttons/AddItemButton";

interface ScriptsSectionProps {
  scripts: ScriptSchema[]; // Replace `any` with the actual Script type
  setIsScriptModalOpen: (open: boolean) => void;
  onDeleteClick: (scriptId: Id<"scripts">) => void;
  onEdit: (script: ScriptSchema) => void;
}

const ScriptsSection: React.FC<ScriptsSectionProps> = ({
  scripts,
  setIsScriptModalOpen,
  onDeleteClick,
  onEdit,
}) => {
  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Scripts"
          actions={
            <AddItemButton
              label="Script"
              onClick={() => setIsScriptModalOpen(true)}
            />
          }
          className="px-0 pb-4"
        />

        {scripts.length === 0 ? (
          <p className="text-grayCustom2">No active scripts found.</p>
        ) : (
          <CardContainer>
            {scripts.map((script) => (
              <ScriptCard
                key={script._id}
                script={script}
                onDelete={() => onDeleteClick(script._id)}
                onEdit={onEdit}
              />
            ))}
          </CardContainer>
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ScriptsSection;
