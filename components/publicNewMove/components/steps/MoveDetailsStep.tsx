"use client";

import { usePublicNewMoveForm } from "@/contexts/PublicNewMoveFormContext";
import MoveDetailsForm from "../form/MoveDetailsForm";

const MoveDetailsStep = () => {
  const { publicNewMoveFormData, setPublicNewMoveFormData } =
    usePublicNewMoveForm();
  const handleChange = (
    key: keyof typeof publicNewMoveFormData,
    value: string
  ) => {
    setPublicNewMoveFormData({ ...publicNewMoveFormData, [key]: value });
  };

  return (
    <MoveDetailsForm
      onChange={handleChange}
      publicNewMoveFormData={publicNewMoveFormData}
    />
  );
};

export default MoveDetailsStep;
