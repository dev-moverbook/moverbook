"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CardContainer from "@/app/components/shared/CardContainer";
import SelectLiabilityCard from "../cards/SelectLiabilityCard";
import Header3 from "@/app/components/shared/heading/Header3";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, X } from "lucide-react";

const LiabilityCoverage = () => {
  const {
    insurancePolicyOptions,
    insurancePolicy,
    setInsurancePolicy,
    isLiabilityCoverageComplete,
  } = useMoveForm();

  const [isEditing, setIsEditing] = useState(false);

  const handleSelect = (id: string) => {
    const selected = insurancePolicyOptions?.find((p) => p._id === id);
    if (selected) {
      setInsurancePolicy(selected);
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer>
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

      <CardContainer>
        {isEditing
          ? insurancePolicyOptions?.map((policy) => (
              <SelectLiabilityCard
                key={policy._id}
                policy={policy}
                isSelected={insurancePolicy?._id === policy._id}
                onSelect={handleSelect}
              />
            ))
          : insurancePolicy && (
              <SelectLiabilityCard
                policy={insurancePolicy}
                isSelected={true}
                onSelect={() => {}}
              />
            )}
      </CardContainer>
    </SectionContainer>
  );
};

export default LiabilityCoverage;
