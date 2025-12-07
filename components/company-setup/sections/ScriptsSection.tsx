"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import CardContainer from "@/components/shared/card/CardContainer";
import AddItemButton from "@/components/shared/buttons/AddItemButton";
import ScriptCard from "@/components/company-setup/components/ScriptCard";

interface ScriptsSectionProps {
  scripts: Doc<"scripts">[];
  setIsScriptModalOpen: (open: boolean) => void;
  setEditingScript: (script: Doc<"scripts"> | null) => void;
  onDeleteClick: (scriptId: Id<"scripts">) => void;
}

const ScriptsSection: React.FC<ScriptsSectionProps> = ({
  scripts,
  setIsScriptModalOpen,
  setEditingScript,
  onDeleteClick,
}) => {
  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Scripts"
          actions={
            <AddItemButton
              label="Script"
              onClick={() => {
                setEditingScript(null);
                setIsScriptModalOpen(true);
              }}
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
                onEdit={() => {
                  setEditingScript(script);
                  setIsScriptModalOpen(true);
                }}
              />
            ))}
          </CardContainer>
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ScriptsSection;
