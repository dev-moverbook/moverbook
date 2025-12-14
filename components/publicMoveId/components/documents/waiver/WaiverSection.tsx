"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import WaiverActions from "./WaiverActions";
import AdditionalLiabilityTerms from "@/components/moveId/components/copy/AdditionalLiabilityTerms";

interface WaiverSectionProps {
  waiver: Doc<"waivers">;
}

const WaiverSection = ({ waiver }: WaiverSectionProps) => {
  const isCompleted = !!waiver.customerSignature;
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  return (
    <CollapsibleSection
      title="Waiver"
      defaultOpen={!isCompleted}
      headerClassName="mx-auto"
      showCheckmark
      isCompleted={isCompleted}
      toggleLabels={{ open: "Hide", closed: "Show" }}
      className="max-w-screen-sm mx-auto border-b md:border-none"
    >
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
        <WaiverActions
          signatureDataUrl={signatureDataUrl}
          waiverId={waiver._id}
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default WaiverSection;
