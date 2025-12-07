"use client";

import LabeledRadio from "@/components/shared/labeled/LabeledRadio";
import { PublicNewMoveFormData } from "@/types/form-types";
import { SERVICE_TYPE_OPTIONS } from "@/types/types";

interface MoveDetailsFormProps {
  onChange: (key: keyof PublicNewMoveFormData, value: string) => void;
  publicNewMoveFormData: PublicNewMoveFormData;
}

const MoveDetailsForm = ({
  onChange,
  publicNewMoveFormData,
}: MoveDetailsFormProps) => {
  return (
    <LabeledRadio
      label="Type of Service"
      name="serviceType"
      value={publicNewMoveFormData.serviceType || ""}
      onChange={(value) => {
        onChange("serviceType", value);
      }}
      options={SERVICE_TYPE_OPTIONS}
    />
  );
};

export default MoveDetailsForm;
