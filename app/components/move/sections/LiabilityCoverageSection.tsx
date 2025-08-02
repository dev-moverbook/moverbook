"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import CardContainer from "@/app/components/shared/CardContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, X } from "lucide-react";
import FieldErrorMessage from "@/app/components/shared/labeled/FieldErrorMessage";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import SelectLiabilityCard from "@/app/app/[slug]/add-move/components/cards/SelectLiabilityCard";

interface LiabilityCoverageSectionProps {
  selectedPolicy: InsurancePolicySchema | null;
  policies: InsurancePolicySchema[];
  onSelect: (policy: InsurancePolicySchema) => void;
  error?: string | null;
  isAdd?: boolean;
}

const LiabilityCoverageSection: React.FC<LiabilityCoverageSectionProps> = ({
  selectedPolicy,
  policies,
  onSelect,
  error,
  isAdd = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const displayPolicy = policies.find((p) => p.name === selectedPolicy?.name);

  const editingMode = isAdd || isEditing;

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          !isAdd && (
            <IconButton
              icon={
                isEditing ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )
              }
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(!isEditing);
              }}
              title={isEditing ? "Cancel" : "Edit"}
            >
              {isEditing ? "Cancel" : "Edit"}
            </IconButton>
          )
        }
      >
        Liability Coverage
      </Header3>

      <SectionContainer>
        <CardContainer>
          {editingMode
            ? policies.map((policy) => (
                <SelectLiabilityCard
                  key={policy.name}
                  policy={policy}
                  isSelected={policy.name === selectedPolicy?.name}
                  onSelect={() => onSelect(policy)}
                />
              ))
            : displayPolicy && <SelectLiabilityCard policy={displayPolicy} />}
        </CardContainer>

        <FieldErrorMessage error={error} />
      </SectionContainer>
    </div>
  );
};

export default LiabilityCoverageSection;
