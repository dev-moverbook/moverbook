"use client";

import { useMoveContext } from "@/app/contexts/MoveContext";
import CustomerInfo from "@/app/components/customer/CustomerInfo";

const ViewCustomer = () => {
  const { moveData } = useMoveContext();
  const moveCustomer = moveData.moveCustomer;

  const isMoverLead = moveData.myAssignment?.isLead;

  return (
    <CustomerInfo
      moveCustomer={moveCustomer}
      showCheckmark={true}
      isMoverLead={isMoverLead}
    />
  );
};

export default ViewCustomer;
