// AddMovePage.tsx
"use client";

import React from "react";
import { MoveFormProvider } from "@/app/contexts/MoveFormContext";
import AddMovePageContent from "./AddMovePageContent";
import { useSlugContext } from "@/app/contexts/SlugContext";

const AddMovePage = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) return null;

  return (
    <MoveFormProvider>
      <AddMovePageContent />
    </MoveFormProvider>
  );
};

export default AddMovePage;
