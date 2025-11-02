"use client";

import { MoveFormProvider } from "@/contexts/MoveFormContext";
import { useSlugContext } from "@/contexts/SlugContext";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import AddMovePageContent from "./AddMovePageContent";

export default function AddMovePage({
  moveCustomerId,
  duplicateFromId,
  fieldsToDuplicate,
  referralParam,
}: {
  moveCustomerId: string | null;
  duplicateFromId: string | null;
  fieldsToDuplicate: string[];
  referralParam?: string;
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
        referralParam={referralParam}
      />
    </MoveFormProvider>
  );
}
