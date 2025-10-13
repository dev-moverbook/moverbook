"use client";

import React from "react";
import { useCustomerAndMoves } from "@/app/hooks/queries/useCustomerAndMoves";
import CustomerPageContent from "./CustomerPageContent";
import { useCustomerId } from "@/app/contexts/CustomerIdContext";

const CustomerPageClient: React.FC = () => {
  const { customerId } = useCustomerId();
  const result = useCustomerAndMoves(customerId);

  switch (result) {
    case undefined:
      return null;
    default:
      const { moveCustomer, moves } = result;
      return <CustomerPageContent moveCustomer={moveCustomer} moves={moves} />;
  }
};

export default CustomerPageClient;
