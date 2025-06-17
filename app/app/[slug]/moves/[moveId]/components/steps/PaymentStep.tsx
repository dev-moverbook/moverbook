import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React from "react";

const PaymentStep = () => {
  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader title="Payment" />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default PaymentStep;
