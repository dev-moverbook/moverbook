"use client";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import FieldDisplay from "@/components/shared/field/FieldDisplay";

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
