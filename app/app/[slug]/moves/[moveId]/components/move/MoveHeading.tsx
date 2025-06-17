import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import React from "react";

interface MoveHeadingProps {
  moveStatus: string;
}

const MoveHeading = ({ moveStatus }: MoveHeadingProps) => {
  return (
    <SectionContainer>
      <FieldDisplay label="Move Status" value={moveStatus} fallback="—" />
    </SectionContainer>
  );
};

export default MoveHeading;
