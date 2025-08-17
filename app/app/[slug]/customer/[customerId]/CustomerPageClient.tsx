"use client";

import React from "react";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useCustomerAndMoves } from "@/app/hooks/queries/useCustomerAndMoves";
import CustomerPageContent from "./CustomerPageContent";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus } from "@/types/enums";

interface Props {
  customerId: Id<"moveCustomers">;
}

const CustomerPageClient: React.FC<Props> = ({ customerId }) => {
  const result = useCustomerAndMoves(customerId);

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;
    case QueryStatus.ERROR:
      return <ErrorComponent message={result.errorMessage} />;
    case QueryStatus.SUCCESS:
      const { moveCustomer, moves } = result.data;
      return <CustomerPageContent moveCustomer={moveCustomer} moves={moves} />;
  }
};

export default CustomerPageClient;
