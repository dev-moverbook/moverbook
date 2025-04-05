"use client";

import { Button } from "@/app/components/ui/button";
import ScriptCard from "../components/ScriptCard";
import { ScriptSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardContainer from "@/app/components/shared/CardContainer";

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
            <Button onClick={() => setIsScriptModalOpen(true)}>
              + Create Script
            </Button>
          }
        />

        {scripts.length === 0 ? (
          <p className="text-gray-500">No active scripts found.</p>
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
