"use client";

import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";

const MessagesPage = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) return null;

  return <div>Messages Page</div>;
};

export default MessagesPage;
