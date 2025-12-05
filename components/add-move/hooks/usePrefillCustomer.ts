"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRunOnceWhen } from "./useRunOnceWhen";
import { CustomerFormData, MoveFormData } from "@/types/form-types";

export function usePrefillCustomer(
  moveCustomerId: string | null,
  setCustomer: (customer: CustomerFormData) => void,
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>,
  onPrefilled?: () => void
) {
  const fetchedCustomer = useQuery(
    api.moveCustomers.getMoveCustomer,
    moveCustomerId ? { moveCustomerId: moveCustomerId as Id<"users"> } : "skip"
  );

  useRunOnceWhen(Boolean(fetchedCustomer && moveCustomerId), () => {
    const customerRecord = fetchedCustomer as NonNullable<
      typeof fetchedCustomer
    >;

    setCustomer({
      name: customerRecord.name,
      email: customerRecord.email,
      phoneNumber: customerRecord.phoneNumber,
      altPhoneNumber: customerRecord.altPhoneNumber ?? "",
    });

    setMoveFormData((previousMoveFormData) => ({
      ...previousMoveFormData,
      moveCustomerId: moveCustomerId as Id<"users">,
    }));

    if (onPrefilled) {
      onPrefilled();
    }
  });
}
