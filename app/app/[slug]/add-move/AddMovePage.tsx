"use client";

import React from "react";
import { MoveFormProvider } from "@/app/contexts/MoveFormContext";
import AddMovePageContent from "./AddMovePageContent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";

export default function AddMovePage({
  moveCustomerId,
  duplicateFromId,
  fieldsToDuplicate,
}: {
  moveCustomerId: string | null;
  duplicateFromId: string | null;
  fieldsToDuplicate: string[];
}) {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  if (!isCompanyContactComplete || !isStripeComplete)
    return (
      <ErrorMessage
        message={
          "You must complete the company contact and stripe information to add a move."
        }
      />
    );

  return (
    <MoveFormProvider>
      <AddMovePageContent
        moveCustomerId={moveCustomerId}
        duplicateFromId={duplicateFromId}
        fieldsToDuplicate={fieldsToDuplicate}
      />
    </MoveFormProvider>
  );
}
