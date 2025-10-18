import SectionContainer from "@/components/shared/containers/SectionContainer";
import FieldDisplay from "@/components/shared/field/FieldDisplay";

interface StepStatusProps {
  items: {
    label: string;
    value: string | null;
    icon?: React.ReactNode;
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
