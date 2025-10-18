import SectionContainer from "@/components/shared/containers/SectionContainer";
import FieldDisplay from "@/components/shared/FieldDisplay";
import React from "react";

const PaymentHeading = () => {
  return (
    <SectionContainer>
      <FieldDisplay label="Payment Status" value={"Pending"} fallback="—" />
    </SectionContainer>
  );
};

export default PaymentHeading;
