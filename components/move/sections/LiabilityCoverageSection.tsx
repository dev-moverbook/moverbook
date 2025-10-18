"use client";

import React, { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import CardContainer from "@/components/shared/CardContainer";
import Header3 from "@/components/shared/heading/Header3";
import IconButton from "@/components/shared/IconButton";
import { Pencil, X } from "lucide-react";
import FieldErrorMessage from "@/components/shared/labeled/FieldErrorMessage";
import SelectLiabilityCard from "@/components/add-move/components/cards/SelectLiabilityCard";
import { Doc } from "@/convex/_generated/dataModel";

interface LiabilityCoverageSectionProps {
  selectedPolicy: Doc<"insurancePolicies"> | null;
  policies: Doc<"insurancePolicies">[];
  onSelect: (policy: Doc<"insurancePolicies">) => Promise<boolean> | boolean;
  error?: string | null;
  isAdd?: boolean;
  isSaving?: boolean;
}

const LiabilityCoverageSection: React.FC<LiabilityCoverageSectionProps> = ({
  selectedPolicy,
  policies,
  onSelect,
  error,
  isAdd = false,
  isSaving = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const displayPolicy = policies.find((p) => p.name === selectedPolicy?.name);
  const editingMode = isAdd || isEditing;

  const handleChoose = async (policy: Doc<"insurancePolicies">) => {
    if (isSaving) return; // guard while saving
    const ok = await Promise.resolve(onSelect(policy));
    if (ok) setIsEditing(false); // only exit edit AFTER success
  };

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          !isAdd && (
            <IconButton
              className={`${isEditing ? "border border-grayCustom" : ""}`}
              icon={
                isEditing ? (
                  <X className="w-4 h-4 " />
                ) : (
                  <Pencil className="w-4 h-4" />
                )
              }
              onClick={(e) => {
                e.preventDefault();
                if (isSaving) return;
                setIsEditing((v) => !v);
              }}
              title={isEditing ? "Cancel" : "Edit"}
              disabled={isSaving}
            >
              {isEditing ? "Cancel" : "Edit"}
            </IconButton>
          )
        }
      >
        Liability Coverage
      </Header3>

      <SectionContainer>
        <CardContainer className="space-y-4">
          {editingMode
            ? policies.map((policy) => (
                <SelectLiabilityCard
                  key={policy.name}
                  policy={policy}
                  isSelected={policy.name === selectedPolicy?.name}
                  onSelect={() => handleChoose(policy)}
                  disabled={isSaving} // if your card supports it
                />
              ))
            : displayPolicy && <SelectLiabilityCard policy={displayPolicy} />}
        </CardContainer>

        <FieldErrorMessage error={error} noPlaceholder={true} />
      </SectionContainer>
    </div>
  );
};

export default LiabilityCoverageSection;
