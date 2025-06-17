"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import CardContainer from "@/app/components/shared/CardContainer";
import SelectLiabilityCard from "../cards/SelectLiabilityCard";
import Header3 from "@/app/components/shared/heading/Header3";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, X } from "lucide-react";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import FieldErrorMessage from "@/app/components/shared/labeled/FieldErrorMessage";

interface LiabilityCoverageProps {
  insurancePolicyOptions?: InsurancePolicySchema[] | null;
  insurancePolicy?: InsurancePolicySchema | null;
  isLiabilityCoverageComplete?: boolean;
  onSelectPolicy: (policy: InsurancePolicySchema) => void;
  error?: string | null;
}

const LiabilityCoverage: React.FC<LiabilityCoverageProps> = ({
  insurancePolicyOptions,
  insurancePolicy,
  isLiabilityCoverageComplete,
  onSelectPolicy,
  error,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedPolicy = insurancePolicyOptions?.find(
    (p) => p.name === insurancePolicy?.name
  );

  return (
    <div>
      <Header3
        isCompleted={isLiabilityCoverageComplete}
        button={
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
              setIsEditing((prev) => !prev);
            }}
            title={isEditing ? "Cancel" : "Edit"}
          >
            {isEditing ? "Cancel" : "Edit"}
          </IconButton>
        }
      >
        Liability Coverage
      </Header3>
      <SectionContainer>
        <CardContainer>
          {isEditing
            ? insurancePolicyOptions?.map((policy) => (
                <SelectLiabilityCard
                  key={policy.name}
                  policy={policy}
                  isSelected={insurancePolicy?.name === policy.name}
                  onSelect={() => {
                    onSelectPolicy(policy);
                    setIsEditing(false);
                  }}
                />
              ))
            : insurancePolicy && (
                <SelectLiabilityCard policy={selectedPolicy} />
              )}
        </CardContainer>
        <FieldErrorMessage error={error} />
      </SectionContainer>
    </div>
  );
};

export default LiabilityCoverage;
