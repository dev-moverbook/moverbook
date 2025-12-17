"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import CustomerInfo from "@/components/customer/CustomerInfo";

const ViewCustomer = () => {
  const { moveData } = useMoveContext();
  const moveCustomer = moveData.moveCustomer;

  const isMoverLead = moveData.myAssignment?.isLead;

  return (
    <CustomerInfo
      moveCustomer={moveCustomer}
      showCheckmark={true}
      isMoverLead={isMoverLead}
      moveId={moveData.move._id}
    />
  );
};

export default ViewCustomer;
