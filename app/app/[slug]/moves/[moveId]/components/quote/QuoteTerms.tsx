"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import MoveTermsAndConditions from "./MoveTermsAndConditions";

interface QuoteTermsProps {
  policy: Doc<"policies">;
}

const QuoteTerms = ({ policy }: QuoteTermsProps) => {
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
