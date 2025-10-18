"use client";
import { MoveFilterProvider } from "@/contexts/MoveFilterContext";
import React from "react";
import CalendarContent from "./CalendarContent";
import { useSlugContext } from "@/contexts/SlugContext";
import ErrorComponent from "../shared/ErrorComponent";

const CalendarPage = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isCalendarBlocked = !isCompanyContactComplete || !isStripeComplete;

  if (isCalendarBlocked) {
    return (
      <ErrorComponent message="You must complete your company contact and Stripe setup to access the calendar." />
    );
  }

  return (
    <MoveFilterProvider>
      <CalendarContent />
    </MoveFilterProvider>
  );
};

export default CalendarPage;
