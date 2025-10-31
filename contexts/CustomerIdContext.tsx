"use client";

import { GetCustomerAndMovesData } from "@/types/convex-responses";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

type CustomerContextType = {
  moveCustomer: GetCustomerAndMovesData;
};

const CustomerIdContext = createContext<CustomerContextType | null>(null);

export function CustomerIdProvider({
  moveCustomerId,
  children,
}: {
  moveCustomerId: Id<"moveCustomers">;
  children: React.ReactNode;
}) {
  const moveCustomer = useQuery(api.moveCustomers.getCustomerAndMoves, {
    moveCustomerId,
  });

  if (!moveCustomer) {
    return;
  }

  return (
    <CustomerIdContext.Provider value={{ moveCustomer }}>
      {children}
    </CustomerIdContext.Provider>
  );
}

export function useCustomerId(): GetCustomerAndMovesData {
  const context = useContext(CustomerIdContext);
  if (!context) {
    throw new Error("CustomerIdProvider missing");
  }

  return context.moveCustomer;
}
