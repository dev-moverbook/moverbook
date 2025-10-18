"use client";
import CustomerInfo from "@/components/customer/CustomerInfo";
import React from "react";
import { useCustomerId } from "@/contexts/CustomerIdContext";
import CustomerMoves from "./CustomerMoves";

const CustomerIdPage: React.FC = () => {
  const {
    moveCustomer: { moveCustomer, moves },
  } = useCustomerId();
  return (
    <div>
      <CustomerInfo moveCustomer={moveCustomer} />
      <CustomerMoves moves={moves} moveCustomer={moveCustomer} />
    </div>
  );
};

export default CustomerIdPage;
