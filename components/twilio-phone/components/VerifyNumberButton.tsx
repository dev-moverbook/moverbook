"use client";

import FormErrorMessage from "@/components/shared/error/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { useValidateTwilioNumber } from "@/hooks/twilio";

interface VerifyNumberButtonProps {
  setInquiryData: (inquiryData: {
    inquiryId: string;
    inquirySessionToken: string;
  }) => void;
}

const VerifyNumberButton = ({ setInquiryData }: VerifyNumberButtonProps) => {
  const { validateTwilioNumber, isLoading, error } = useValidateTwilioNumber();
  const handleValidateTwilioNumber = async () => {
    const inquiryData = await validateTwilioNumber();
    if (inquiryData) {
      setInquiryData(inquiryData);
    }
  };
  return (
    <div className="mt-4">
      <Button
        onClick={handleValidateTwilioNumber}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Verify Phone Number
      </Button>
      {error && <FormErrorMessage message={error} />}
    </div>
  );
};

export default VerifyNumberButton;
