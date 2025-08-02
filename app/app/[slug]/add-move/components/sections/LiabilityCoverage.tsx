"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import CardContainer from "@/app/components/shared/CardContainer";
import SelectLiabilityCard from "../cards/SelectLiabilityCard";
import Header3 from "@/app/components/shared/heading/Header3";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, X } from "lucide-react";
import FieldErrorMessage from "@/app/components/shared/labeled/FieldErrorMessage";
import { useMoveForm } from "@/app/contexts/MoveFormContext";

interface LiabilityCoverageProps {}

const LiabilityCoverage: React.FC<LiabilityCoverageProps> = ({}) => {
  const {
    moveFormData,
    setMoveFormData,
    moveFormErrors,
    insurancePolicyOptions,
  } = useMoveForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedPolicy = insurancePolicyOptions?.find(
    (p) => p.name === moveFormData.liabilityCoverage?.name
  );

  return (
    <div>
      <Header3
        showCheckmark={false}
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
                  isSelected={
                    moveFormData.liabilityCoverage?.name === policy.name
                  }
                  onSelect={() => {
                    setMoveFormData({
                      ...moveFormData,
                      liabilityCoverage: policy,
                    });
                    setIsEditing(false);
                  }}
                />
              ))
            : moveFormData.liabilityCoverage && (
                <SelectLiabilityCard policy={selectedPolicy} />
              )}
        </CardContainer>
        <FieldErrorMessage error={moveFormErrors.liabilityCoverage} />
      </SectionContainer>
    </div>
  );
};

export default LiabilityCoverage;
