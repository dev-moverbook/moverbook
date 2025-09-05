import CustomerInfo from "@/app/components/customer/CustomerInfo";
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import CustomerMoves from "./components/CustomerMoves";
import { EnrichedMoveForMover } from "@/types/convex-responses";

interface CustomerPageContentProps {
  moveCustomer: Doc<"moveCustomers">;
  moves: EnrichedMoveForMover[];
}

const CustomerPageContent: React.FC<CustomerPageContentProps> = ({
  moveCustomer,
  moves,
}) => {
  return (
    <div>
      <CustomerInfo moveCustomer={moveCustomer} />
      <CustomerMoves moves={moves} moveCustomer={moveCustomer} />
    </div>
  );
};

export default CustomerPageContent;
