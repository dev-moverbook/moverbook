"use client";

import { useMoveContext } from "@/app/contexts/MoveContext";
import CustomerInfo from "@/app/components/customer/CustomerInfo";

const ViewCustomer = () => {
  const { moveData } = useMoveContext();
  const moveCustomer = moveData.moveCustomer;

  return <CustomerInfo moveCustomer={moveCustomer} showCheckmark={true} />;
};

export default ViewCustomer;
