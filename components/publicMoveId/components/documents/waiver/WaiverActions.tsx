"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useCustomerSignWaiver } from "@/hooks/waivers";

interface WaiverActionsProps {
  signatureDataUrl: string | null;
  waiverId: Id<"waivers">;
}

const WaiverActions = ({ signatureDataUrl, waiverId }: WaiverActionsProps) => {
  const { customerSignWaiver, isLoading, error } = useCustomerSignWaiver();

  const handleSubmit = async () => {
    if (signatureDataUrl) {
      await customerSignWaiver(waiverId, {
        customerSignature: signatureDataUrl,
      });
    }
  };
  return (
    <SingleFormAction
      submitLabel="Submit"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      error={error}
      disabled={!signatureDataUrl}
    />
  );
};

export default WaiverActions;
