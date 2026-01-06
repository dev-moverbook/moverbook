"use client";

import { Doc } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/section/SectionContainer";
import SectionHeaderWithAction from "../shared/section/SectionHeaderWithAction";
import FieldDisplay from "../shared/field/FieldDisplay";
import CenteredContainer from "../shared/containers/CenteredContainer";
import TwilioActionButton from "./components/TwilioActionButton";
import { formatPhoneNumber } from "@/frontendUtils/helper";

interface TwilioPhoneContentProps {
  twilioPhoneNumber: Doc<"twilioPhoneNumbers"> | null;
}

const TwilioPhoneContent = ({ twilioPhoneNumber }: TwilioPhoneContentProps) => {
  return (
    <SectionContainer isLast={true}>
      <SectionHeaderWithAction title="Twilio Phone Number" />

      <CenteredContainer className="md:px-0">
        <div className="mt-4">
          <FieldDisplay
            label="Phone Number"
            value={formatPhoneNumber(
              twilioPhoneNumber?.phoneNumberE164 || "No phone number set"
            )}
          />
        </div>
        <TwilioActionButton twilioPhoneNumber={twilioPhoneNumber} />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default TwilioPhoneContent;
