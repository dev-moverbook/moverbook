"use client";
import React from "react";
import StripePageContent from "./StripePageContent";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseStatus } from "@/types/enums";

const StripePage = () => {
  const stripeConnectionResponse = useQuery(
    api.connectedAccount.getStripeConnection
  );

  if (stripeConnectionResponse === undefined) {
    return <Skeleton className="" />;
  }
  if (stripeConnectionResponse.status === ResponseStatus.ERROR)
    return <div>Error: {stripeConnectionResponse.error}</div>;

  const connectedAccount = stripeConnectionResponse.data.stripeConnected;

  return (
    <main className="min-h-100vh">
      <StripePageContent connectedAccount={connectedAccount} />
    </main>
  );
};

export default StripePage;
