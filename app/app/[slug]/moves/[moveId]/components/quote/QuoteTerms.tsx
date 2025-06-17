"use client";

import React from "react";
import { MoveSchema, PolicySchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { MOVE_TERMS_AND_CONDITIONS } from "@/types/const";

interface QuoteTermsProps {
  move: MoveSchema;
  policy: PolicySchema;
}

const QuoteTerms = ({ move, policy }: QuoteTermsProps) => {
  const additionalTermsAndConditions = policy.additionalTermsAndConditions;
  return (
    <div>
      <SectionHeader title="Terms" />
      <SectionContainer>
        <div
          className="prose prose-sm max-w-none md:text-sm"
          dangerouslySetInnerHTML={{ __html: MOVE_TERMS_AND_CONDITIONS }}
        />
        {additionalTermsAndConditions && (
          <p className="mt-4 md:text-sm">{additionalTermsAndConditions}</p>
        )}
      </SectionContainer>
    </div>
  );
};

export default QuoteTerms;
