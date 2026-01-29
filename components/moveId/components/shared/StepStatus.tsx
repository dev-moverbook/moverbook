"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import FieldDisplay from "@/components/shared/field/FieldDisplay";

interface StepStatusProps {
  items: {
    label: string;
    value: string | null;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

const StepStatus = ({ items, className }: StepStatusProps) => {
  return (
    <SectionContainer className={className}>
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
