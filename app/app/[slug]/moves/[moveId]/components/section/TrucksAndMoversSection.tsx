"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import { MoveSchema } from "@/types/convex-schemas";
import FormActions from "@/app/components/shared/FormActions";
import SelectFieldRow from "@/app/components/shared/SelectFieldRow";
import { useReferralSources } from "@/app/hooks/queries/useReferralSources";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { InfoFormData } from "@/types/form-types";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { cn } from "@/lib/utils";
import {
  ContactValidationErrors,
  validateContactForm,
} from "@/app/frontendUtils/validation";

interface TrucksAndMoversSectionProps {
  move: MoveSchema;
}

const TrucksAndMoversSection = ({ move }: TrucksAndMoversSectionProps) => {
  const handleSave = async () => {
    return <div></div>;
  };
};

export default TrucksAndMoversSection;
