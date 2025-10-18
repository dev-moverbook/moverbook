"use client";

import { GetCustomerAndMovesData } from "@/types/convex-responses";
import { createContext, useContext } from "react";

type CustomerId = { moveCustomer: GetCustomerAndMovesData };

const CustomerIdContext = createContext<CustomerId | null>(null);

export function CustomerIdProvider({
  moveCustomer,
  children,
}: {
  moveCustomer: GetCustomerAndMovesData;
  children: React.ReactNode;
}) {
  return (
    <CustomerIdContext.Provider value={{ moveCustomer }}>
      {children}
    </CustomerIdContext.Provider>
  );
}

export function useCustomerId(): CustomerId {
  const context = useContext(CustomerIdContext);
  if (!context) {
    throw new Error("CustomerIdProvider missing");
  }

  return context;
}
