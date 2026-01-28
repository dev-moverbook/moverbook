"use client";

import LabeledSelect from "@/components/shared/labeled/LabeledSelect";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { useGetSalesReps } from "@/hooks/users/useGetSalesReps";
import { Id } from "@/convex/_generated/dataModel";
import { SalesRepOption } from "@/contexts/MoveFilterContext";

type BaseProps = {
  companyId: Id<"companies">;
  label?: string;
  isEditing?: boolean;
  placeholder?: string;
  error?: string | null;
};

type PropsByOption = {
  value: SalesRepOption | null;
  onChange: (val: SalesRepOption | null) => void;
  valueId?: never;
  onChangeId?: never;
};

type PropsById = {
  valueId: Id<"users"> | string | null;
  onChangeId: (id: string | null) => void;
  value?: never;
  onChange?: never;
};

export type SalesRepOptionsSelectProps = BaseProps &
  (PropsByOption | PropsById);

const SalesRepOptionsSelect: React.FC<SalesRepOptionsSelectProps> = (props) => {
  const {
    companyId,
    label = "Sales Rep",
    isEditing = true,
    placeholder,
    error,
  } = props;

  const result = useGetSalesReps(companyId);

  let loading: boolean = false;
  const options: { label: string; value: string }[] = [];

  switch (result) {
    case undefined:
      loading = true;
      break;

    default:
      for (const user of result) {
        options.push({ label: user.name, value: user._id });
      }
      break;
  }

  const currentId =
    "value" in props ? (props.value?.id ?? null) : (props.valueId ?? null);

  if (!isEditing) {
    const currentName =
      options.find((option) => option.value === currentId)?.label ??
      (loading ? "Loading..." : "—");
    return <FieldDisplay label={label} value={currentName} />;
  }

  return (
    <LabeledSelect
      label={label}
      value={currentId}
      options={options}
      onChange={(id) => {
        if ("onChange" in props) {
          if (!id) return props.onChange?.(null);
          const match = options.find((o) => o.value === id);
          props.onChange?.(
            match ? { id: match.value as Id<"users">, name: match.label } : null
          );
        } else {
          props.onChangeId(id ?? null);
        }
      }}
      placeholder={placeholder}
      loading={loading}
      error={error}
    />
  );
};

export default SalesRepOptionsSelect;
