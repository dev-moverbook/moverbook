"use client";

import { useGetSalesReps } from "@/hooks/users/useGetSalesReps";
import { Id } from "@/convex/_generated/dataModel";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";
import AdaptiveContainer from "@/components/shared/select/AdaptiveContainer";
import { Label } from "@/components/ui/label";

type SalesRepSelectProps = {
  companyId: Id<"companies">;
  valueId: Id<"users"> | string | null;
  onChange: (id: Id<"users">) => void;
  label?: string;
  disabled?: boolean;
};

const SalesRepSelect: React.FC<SalesRepSelectProps> = ({
  companyId,
  valueId,
  onChange,
  label = "Sales Rep",
  disabled = false,
}) => {
  const result = useGetSalesReps(companyId);

  const options = (result ?? []).map((user) => ({
    label: user.name,
    value: user._id,
    image: user.imageUrl, // AdaptiveSelect usually supports images
  }));

  return (
    <AdaptiveContainer>
      <Label>{label}</Label>
      <AdaptiveSelect
        title="Select Sales Rep"
        options={options}
        value={valueId ?? ""}
        onChange={(val) => onChange(val as Id<"users">)}
        placeholder="Select a sales rep"
        triggerLabel="Sales Rep"
        showSearch={true}
        disabled={disabled}
        description="Select a sales rep for the move."
      />
    </AdaptiveContainer>
  );
};

export default SalesRepSelect;
