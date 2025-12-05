"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GetCustomerAndMovesData } from "@/types/convex-responses";

export const useCustomerAndMoves = (
  moveCustomerId: Id<"users">,
  slug: string
): GetCustomerAndMovesData | undefined => {
  const response = useQuery<typeof api.moveCustomers.getCustomerAndMoves>(
    api.moveCustomers.getCustomerAndMoves,
    { moveCustomerId, slug }
  );
  return response;
};
