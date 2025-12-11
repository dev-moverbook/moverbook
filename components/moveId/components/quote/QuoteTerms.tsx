"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import MoveTermsAndConditions from "./MoveTermsAndConditions";
import { Doc } from "@/convex/_generated/dataModel";

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
