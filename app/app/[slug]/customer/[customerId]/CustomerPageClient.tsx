"use client";

import React from "react";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import FullLoading from "@/app/components/shared/FullLoading";
import { useCustomerAndMoves } from "@/app/hooks/queries/useCustomerAndMoves";
import CustomerPageContent from "./CustomerPageContent";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  customerId: Id<"moveCustomers">;
}

const CustomerPageClient: React.FC<Props> = ({ customerId }) => {
  const { data, isLoading, isError, errorMessage } =
    useCustomerAndMoves(customerId);

  if (isLoading) return <FullLoading />;
  if (isError) return <ErrorComponent message={errorMessage} />;
  if (!data?.moveCustomer || !data?.moves) {
    return <ErrorComponent message="Customer data not found" />;
  }

  return (
    <CustomerPageContent moveCustomer={data.moveCustomer} moves={data.moves} />
  );
};

export default CustomerPageClient;
