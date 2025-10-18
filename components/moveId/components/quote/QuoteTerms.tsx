"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import MoveTermsAndConditions from "./MoveTermsAndConditions";
import { useMoveContext } from "@/contexts/MoveContext";

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
