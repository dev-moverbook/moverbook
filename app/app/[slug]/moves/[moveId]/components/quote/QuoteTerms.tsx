"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import MoveTermsAndConditions from "./MoveTermsAndConditions";
import { useMoveContext } from "@/app/contexts/MoveContext";

const QuoteTerms = () => {
  const { moveData } = useMoveContext();
  const { policy } = moveData;
  const additionalTermsAndConditions = policy.additionalTermsAndConditions;
  return (
    <div>
      <SectionHeader className="mx-auto" title="Terms" />
      <SectionContainer>
        <MoveTermsAndConditions
          additionalTermsAndConditions={additionalTermsAndConditions}
        />
      </SectionContainer>
    </div>
  );
};

export default QuoteTerms;
