import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import React from "react";

const PaymentHeading = () => {
  return (
    <SectionContainer>
      <FieldDisplay label="Payment Status" value={"Pending"} fallback="—" />
    </SectionContainer>
  );
};

export default PaymentHeading;
