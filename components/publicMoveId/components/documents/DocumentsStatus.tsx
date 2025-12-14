"use client";

import StepStatus from "@/components/moveId/components/shared/StepStatus";
import { Doc } from "@/convex/_generated/dataModel";
import { getPublicDocumentsStatus } from "@/frontendUtils/tsxHelper";

interface DocumentsStatusProps {
  contract: Doc<"contracts"> | null;
  waiver: Doc<"waivers"> | null;
}

const DocumentsStatus = ({ contract, waiver }: DocumentsStatusProps) => {
  const documentsStatus = getPublicDocumentsStatus(contract, waiver);
  return (
    <StepStatus
      items={[
        {
          label: "Documents Status",
          value: documentsStatus.label,
          icon: documentsStatus.icon,
        },
      ]}
    />
  );
};

export default DocumentsStatus;
