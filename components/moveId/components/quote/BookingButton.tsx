"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useMarkAsBooked } from "@/hooks/messages";

interface BookingButtonProps {
  moveId: Id<"moves">;
  customerSignatureDataUrl?: string | null;
  salesRepSignatureDataUrl?: string | null;
}

const BookingButton = ({
  moveId,
  customerSignatureDataUrl,
  salesRepSignatureDataUrl,
}: BookingButtonProps) => {
  const { markAsBooked, isLoading, error } = useMarkAsBooked();
  const handleMarkAsComplete = async () => {
    await markAsBooked({
      moveId,
      customerSignature: customerSignatureDataUrl || undefined,
      salesRepSignature: salesRepSignatureDataUrl || undefined,
      updateQuote: true,
    });
  };

  return (
    <SingleFormAction
      submitLabel="Mark as Booked"
      onSubmit={handleMarkAsComplete}
      isSubmitting={isLoading}
      error={error}
      submitVariant="default"
    />
  );
};

export default BookingButton;
