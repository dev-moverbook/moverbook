"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { ResponseStatus } from "@/types/enums";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import LaborSection from "../sections/LaborSection";
import LiabilitySection from "../sections/LiabilitySection";
import TravelFeeSection from "../sections/TravelFeeSection";
import FeesSection from "../sections/FeesSection";
import CreditCardFeeSection from "../sections/CreditCardFeeSection";

const RatesTab = () => {
  const { companyId } = useSlugContext();

  const queryResult = useQuery(
    api.labor.getCompanyRates,
    companyId ? { companyId } : "skip"
  );

  if (!queryResult || !companyId) {
    return <RenderSkeleton />;
  }

  if (queryResult.status === ResponseStatus.ERROR) {
    return <ErrorComponent message={queryResult.error} />;
  }

  const { labor, insurancePolicies, travelFee, creditCardFee, fees } =
    queryResult.data;

  return (
    <div className="p-4 space-y-6">
      <LaborSection labor={labor} companyId={companyId} />
      <LiabilitySection policies={insurancePolicies} companyId={companyId} />
      <TravelFeeSection travelFee={travelFee} />
      <CreditCardFeeSection creditCardFee={creditCardFee} />
      <FeesSection fees={fees} companyId={companyId} />
    </div>
  );
};

export default RatesTab;
