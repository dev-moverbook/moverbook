"use client";

import StepStatus from "@/components/moveId/components/shared/StepStatus";
import { DisplayQuoteStatus } from "@/types/types";

export interface PublicQuoteStatusProps {
  quoteStatus: DisplayQuoteStatus;
}

const QuoteStatus = ({ quoteStatus }: PublicQuoteStatusProps) => {
  return (
    <StepStatus
      items={[
        {
          label: "Quote Status",
          value: quoteStatus.label,
          icon: quoteStatus.icon,
        },
      ]}
    />
  );
};

export default QuoteStatus;
