import CardContainer from "@/app/components/shared/CardContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CostCard from "@/app/components/move/CostCard";

const LocationSummary = () => {
  const { companyContact, locations } = useMoveForm();

  return (
    <SectionContainer showBorder={false}>
      <Header3 showCheckmark={false}>Summary</Header3>

      <CardContainer>
        <CostCard />
      </CardContainer>
    </SectionContainer>
  );
};

export default LocationSummary;
