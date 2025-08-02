"use client";

import React from "react";
import { MoveFilterProvider } from "@/app/contexts/MoveFilterContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import CalendarPageContent from "./CalendarPageContent";

const CalendarPage = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) return null;

  return (
    <MoveFilterProvider>
      <CalendarPageContent />
    </MoveFilterProvider>
  );
};

export default CalendarPage;
