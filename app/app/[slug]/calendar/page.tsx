"use client";

import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import CalendarPageContent from "./CalendarPageContent";

export default function CalendarPage() {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isCalendarBlocked = !isCompanyContactComplete || !isStripeComplete;

  if (isCalendarBlocked) {
    return (
      <ErrorComponent message="You must complete your company contact and Stripe setup to access the calendar." />
    );
  }

  return <CalendarPageContent />;
}
