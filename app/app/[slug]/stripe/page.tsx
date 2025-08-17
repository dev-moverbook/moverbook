"use client";

import React from "react";
import StripePageContent from "./StripePageContent";
import { useStripeConnection } from "@/app/hooks/queries/stripe/useStripeConnection";
import { QueryStatus } from "@/types/enums";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";

const StripePage = () => {
  const result = useStripeConnection();

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;

    case QueryStatus.ERROR:
      return <ErrorMessage message={result.errorMessage} />;

    case QueryStatus.SUCCESS:
      return (
        <main className="min-h-100vh">
          <StripePageContent connectedAccount={result.connectedAccount} />
        </main>
      );
  }
};

export default StripePage;
