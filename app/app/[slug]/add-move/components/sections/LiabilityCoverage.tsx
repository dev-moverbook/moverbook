"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CardContainer from "@/app/components/shared/CardContainer";
import SelectLiabilityCard from "../cards/SelectLiabilityCard";
import Header3 from "@/app/components/shared/heading/Header3";

const LiabilityCoverage = () => {
  const { insurancePolicyOptions, insurancePolicy, setInsurancePolicy } =
    useMoveForm();

  const isCompleted = insurancePolicy != null;
  return (
    <SectionContainer>
      <Header3 isCompleted={isCompleted}>Liability Coverage</Header3>
      <CardContainer>
        {insurancePolicyOptions?.map((policy) => (
          <SelectLiabilityCard
            key={policy._id}
            policy={policy}
            isSelected={insurancePolicy === policy}
            onSelect={(id) => {
              const selected = insurancePolicyOptions.find((p) => p._id === id);
              if (selected) setInsurancePolicy(selected);
            }}
          />
        ))}
      </CardContainer>
    </SectionContainer>
  );
};

export default LiabilityCoverage;
