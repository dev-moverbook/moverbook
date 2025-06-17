import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import React from "react";

interface QuoteHeadingProps {
  moveStatus: string;
  title: string | null;
}

const QuoteHeading = ({ moveStatus, title }: QuoteHeadingProps) => {
  return (
    <SectionContainer showBorder={false}>
      <FieldDisplay label="Quote Status" value={moveStatus} fallback="—" />
      {title && <FieldDisplay label="Title" value={title} fallback="—" />}
    </SectionContainer>
  );
};

export default QuoteHeading;
