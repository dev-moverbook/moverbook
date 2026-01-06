"use client";
import { useTwilioPhoneNumber } from "@/hooks/twilio";
import TwilioPhoneContent from "./TwilioPhoneContent";
import { useSlugContext } from "@/contexts/SlugContext";

const TwilioPhonePage = () => {
  const { companyId } = useSlugContext();
  const twilioPhoneNumber = useTwilioPhoneNumber(companyId);

  if (twilioPhoneNumber === undefined) {
    return null;
  }
  return <TwilioPhoneContent twilioPhoneNumber={twilioPhoneNumber} />;
};

export default TwilioPhonePage;
