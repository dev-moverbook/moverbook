"use client";

import { GetCustomerAndMovesData } from "@/types/convex-responses";
import { createContext, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useCustomerAndMoves } from "@/hooks/moveCustomers/useCustomerAndMoves";

type CustomerContextType = {
  moveCustomer: GetCustomerAndMovesData;
};

const CustomerIdContext = createContext<CustomerContextType | null>(null);

export function CustomerIdProvider({
  moveCustomerId,
  slug,
  children,
}: {
  moveCustomerId: Id<"users">;
  slug: string;
  children: React.ReactNode;
}) {
  const moveCustomer = useCustomerAndMoves(moveCustomerId, slug);

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
