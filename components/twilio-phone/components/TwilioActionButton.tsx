"use client";

import { Doc } from "@/convex/_generated/dataModel";
import GetNumberButton from "./GetNumberButton";
import VerifyNumberButton from "./VerifyNumberButton";
import { useState } from "react";
import VerifyNumberForm from "./VerifyNumberForm";

interface TwilioActionButtonProps {
  twilioPhoneNumber: Doc<"twilioPhoneNumbers"> | null;
}

const TwilioActionButton = ({ twilioPhoneNumber }: TwilioActionButtonProps) => {
  const noNumber = twilioPhoneNumber === null;
  const needsVerification =
    twilioPhoneNumber?.tollfreeVerificationStatus === "Verification Required";
  const phoneNumber = twilioPhoneNumber?.phoneNumberE164;

  const [inquiryData, setInquiryData] = useState<{
    inquiryId: string;
    inquirySessionToken: string;
  } | null>(null);

  if (noNumber) {
    return <GetNumberButton />;
  }

  if (needsVerification && !inquiryData) {
    return <VerifyNumberButton setInquiryData={setInquiryData} />;
  }

  if (inquiryData && phoneNumber) {
    return (
      <VerifyNumberForm
        inquiryId={inquiryData.inquiryId}
        inquirySessionToken={inquiryData.inquirySessionToken}
        twilioPhoneNumberId={twilioPhoneNumber._id}
      />
    );
  }
};

export default TwilioActionButton;
