"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import StripeContent from "./StripeContent";

const StripePage = () => {
  const connectedAccount = useQuery(api.connectedAccounts.getStripeConnection);

  if (!connectedAccount) {
    return;
  }
  return <StripeContent connectedAccount={connectedAccount} />;
};

export default StripePage;
