"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import CustomerInfo from "@/components/customer/CustomerInfo";
import { isMoveCompleted } from "@/frontendUtils/moveHelper";

const ViewCustomer = () => {
  const { moveData } = useMoveContext();
  const moveCustomer = moveData.moveCustomer;

  const isMoverLead = moveData.myAssignment?.isLead;

  const isUneditable = isMoveCompleted(moveData.move);

  return (
    <CustomerInfo
      moveCustomer={moveCustomer}
      showCheckmark={true}
      isMoverLead={isMoverLead}
      moveId={moveData.move._id}
      isUneditable={isUneditable}
    />
  );
};

export default ViewCustomer;
