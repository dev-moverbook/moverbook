"use client";

import { Id } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type CustomerId = { customerId: Id<"moveCustomers"> };

const CustomerIdContext = createContext<CustomerId | null>(null);

export function UserIdProvider({
  customerId,
  children,
}: {
  customerId: Id<"moveCustomers">;
  children: React.ReactNode;
}) {
  return (
    <CustomerIdContext.Provider value={{ customerId }}>
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
