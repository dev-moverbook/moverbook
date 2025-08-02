import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import React from "react";

interface StepStatusProps {
  items: {
    label: string;
    value: string | null;
    icon?: React.ReactNode; // ⬅️ New
  }[];
}

const StepStatus = ({ items }: StepStatusProps) => {
  return (
    <SectionContainer showBorder={false}>
      {items.map((item, i) => (
        <FieldDisplay
          key={i}
          label={item.label}
          value={item.value}
          icon={item.icon}
          fallback="—"
        />
      ))}
    </SectionContainer>
  );
};

export default StepStatus;
