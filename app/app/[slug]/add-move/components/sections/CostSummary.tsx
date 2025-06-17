import CardContainer from "@/app/components/shared/CardContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import CostCard from "@/app/components/move/CostCard";

const CostSummary = () => {
  return (
    <div>
      <Header3 showCheckmark={false}>Cost Summary</Header3>
      <SectionContainer showBorder={false}>
        <CardContainer>
          <CostCard />
        </CardContainer>
      </SectionContainer>
    </div>
  );
};

export default CostSummary;
