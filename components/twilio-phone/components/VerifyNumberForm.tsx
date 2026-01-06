"use client";

import { useState } from "react";
import { TwilioComplianceEmbed } from "@twilio/twilio-compliance-embed";
import FormErrorMessage from "@/components/shared/error/FormErrorMessage";
import { useUpdateTwilioNumber } from "@/hooks/twilio/useUpdateTwilioNumber";
import { Id } from "@/convex/_generated/dataModel";

interface VerifyNumberFormProps {
  inquiryId: string;
  inquirySessionToken: string;
  twilioPhoneNumberId: Id<"twilioPhoneNumbers">;
}

const VerifyNumberForm = ({
  inquiryId,
  inquirySessionToken,
  twilioPhoneNumberId,
}: VerifyNumberFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorTwilioVerification, setErrorTwilioVerification] = useState<
    string | null
  >(null);

  const { updateTwilioNumber, error } = useUpdateTwilioNumber();

  const handleSubmitted = async () => {
    await updateTwilioNumber(twilioPhoneNumberId, {
      tollfreeVerificationStatus: "Pending Review",
      tollfreeInquiryId: inquiryId,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="mt-6 rounded-lg border  p-6">
      <h3 className="mb-4 text-lg font-semibold">
        Complete Toll-Free Verification
      </h3>
      <p className="mb-6 text-sm ">
        Fill in your business details in the secure Twilio form below. This is
        required to send messages. You may use the SMS Consent Link for the opt
        in input.
      </p>
      {isSubmitted ? (
        <p className="mb-6 text-sm ">
          Your phone number verification is in progress.
        </p>
      ) : (
        <div className="rounded-md h-[800px]">
          <TwilioComplianceEmbed
            inquiryId={inquiryId}
            inquirySessionToken={inquirySessionToken}
            onInquirySubmitted={handleSubmitted}
            onError={() =>
              setErrorTwilioVerification("Error submitting inquiry")
            }
            className="rounded-md"
            widgetPadding={{
              top: 10,
              bottom: 10,
            }}
          />
          <FormErrorMessage message={errorTwilioVerification} />
          <FormErrorMessage message={error} />
        </div>
      )}
    </div>
  );
};

export default VerifyNumberForm;
