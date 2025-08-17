"use client";

import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import MessagesPage from "./MessagesPage";

const Page = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) return null;

  return (
    <main>
      <SectionHeaderWithAction title="Messages" />
      <MessagesPage />
    </main>
  );
};

export default Page;
