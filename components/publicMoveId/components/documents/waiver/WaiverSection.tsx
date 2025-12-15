"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";

import WaiverActions from "./WaiverActions";
import AdditionalLiabilityTerms from "@/components/moveId/components/copy/AdditionalLiabilityTerms";
import SectionHeader from "@/components/shared/section/SectionHeader";

interface WaiverSectionProps {
  waiver: Doc<"waivers">;
}

const WaiverSection = ({ waiver }: WaiverSectionProps) => {
  const isCompleted = !!waiver.customerSignature;
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const showWaiverActions = !waiver.customerSignature;

  return (
    <>
      <SectionHeader title="Waiver" isCompleted={isCompleted} showCheckmark />
      <SectionContainer showBorder={false}>
        <AdditionalLiabilityTerms />
        {waiver.repSignature && waiver.repSignedAt && (
          <DisplaySignature
            image={waiver.repSignature}
            timestamp={waiver.repSignedAt}
            alt="Rep Signature"
            title="Rep Signature"
          />
        )}
        {waiver.customerSignature && waiver.customerSignedAt ? (
          <DisplaySignature
            image={waiver.customerSignature}
            timestamp={waiver.customerSignedAt}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature
            title="Customer Signature"
            onChange={setSignatureDataUrl}
          />
        )}
        {showWaiverActions && (
          <WaiverActions
            signatureDataUrl={signatureDataUrl}
            waiverId={waiver._id}
          />
        )}
      </SectionContainer>
    </>
  );
};

export default WaiverSection;
