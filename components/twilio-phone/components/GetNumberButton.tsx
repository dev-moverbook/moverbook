"use client";

import FormErrorMessage from "@/components/shared/error/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { useSlugContext } from "@/contexts/SlugContext";
import { useCreateTwilioNumber } from "@/hooks/twilio";

const GetNumberButton = () => {
  const { createTwilioNumber, isLoading, error } = useCreateTwilioNumber();
  const { companyId } = useSlugContext();
  const handleCreateTwilioNumber = async () => {
    await createTwilioNumber(companyId);
  };
  return (
    <div className="mt-4">
      <Button
        onClick={handleCreateTwilioNumber}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Get Phone Number
      </Button>
      {error && <FormErrorMessage message={error} />}
    </div>
  );
};

export default GetNumberButton;
