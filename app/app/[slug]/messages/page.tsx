"use client";

import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import MessagesPage from "./MessagesPage";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";

const Page = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) {
    return (
      <ErrorMessage message="You must complete your company contact and Stripe setup to access the messages." />
    );
  }

  return (
    <main>
      <SectionHeaderWithAction title="Messages" />
      <MessagesPage />
    </main>
  );
};

export default Page;
