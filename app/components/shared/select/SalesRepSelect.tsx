// app/components/shared/select/SalesRepSelect.tsx
"use client";

import React from "react";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import { useGetSalesReps } from "@/app/hooks/queries/useGetSalesReps";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus } from "@/types/enums";
import { SalesRepOption } from "@/app/contexts/MoveFilterContext";

type BaseProps = {
  companyId: Id<"companies"> | null;
  label?: string;
  isEditing?: boolean;
  placeholder?: string;
  error?: string | null; // form-level validation error (optional)
};

// Option-style API (what your modal currently uses)
type PropsByOption = {
  value: SalesRepOption | null;
  onChange: (val: SalesRepOption | null) => void;
  valueId?: never;
  onChangeId?: never;
};

// Id-style API (backwards-compatible)
type PropsById = {
  valueId: Id<"users"> | string | null;
  onChangeId: (id: string | null) => void;
  value?: never;
  onChange?: never;
};

export type SalesRepSelectProps = BaseProps & (PropsByOption | PropsById);

const SalesRepSelect: React.FC<SalesRepSelectProps> = (props) => {
  const {
    companyId,
    label = "Sales Rep",
    isEditing = true,
    placeholder,
    error,
  } = props;

  const result = useGetSalesReps(companyId);

  let loading = false;
  let queryError: string | null = null;
  const options: { label: string; value: string }[] = [];

  switch (result.status) {
    case QueryStatus.LOADING:
      loading = true;
      break;
    case QueryStatus.ERROR:
      queryError = result.errorMessage ?? "Failed to load sales reps.";
      break;
    case QueryStatus.SUCCESS:
      for (const u of result.data) {
        options.push({ label: u.name, value: u._id });
      }
      break;
  }

  // Resolve current id regardless of which prop shape is used
  const currentId =
    "value" in props ? (props.value?.id ?? null) : (props.valueId ?? null);

  // Read-only view
  if (!isEditing) {
    const currentName =
      options.find((o) => o.value === currentId)?.label ??
      (loading ? "Loading..." : "—");
    return <FieldDisplay label={label} value={currentName} />;
  }

  // Editing view: pass id to the generic select
  return (
    <LabeledSelect
      label={label}
      value={currentId}
      options={options}
      onChange={(id) => {
        if ("onChange" in props) {
          // Option-style callback: return {id, name}
          if (!id) return props.onChange?.(null);
          const match = options.find((o) => o.value === id);
          props.onChange?.(
            match ? { id: match.value as Id<"users">, name: match.label } : null
          );
        } else {
          // Id-style callback
          props.onChangeId(id ?? null);
        }
      }}
      placeholder={placeholder}
      loading={loading}
      queryError={queryError}
      error={error}
    />
  );
};

export default SalesRepSelect;
