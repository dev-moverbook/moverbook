"use client";

import React from "react";
import StripePageContent from "./StripePageContent";
import { useStripeConnection } from "@/app/hooks/queries/stripe/useStripeConnection";

const StripePage = () => {
  const result = useStripeConnection();

  switch (result) {
    case undefined:
      return null;

    default:
      return (
        <main className="min-h-100vh">
          <StripePageContent connectedAccount={result} />
        </main>
      );
  }
};

export default StripePage;
