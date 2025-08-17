"use client";

import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import LaborSection from "../sections/LaborSection";
import LiabilitySection from "../sections/LiabilitySection";
import TravelFeeSection from "../sections/TravelFeeSection";
import FeesSection from "../sections/FeesSection";
import CreditCardFeeSection from "../sections/CreditCardFeeSection";
import { QueryStatus } from "@/types/enums";
import { useCompanyRates } from "@/app/hooks/queries/labor/useCompanyRates";

const RatesTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyRates(companyId);

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorComponent message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS: {
      const { labor, insurancePolicies, travelFee, creditCardFee, fees } =
        result.data;

      content = (
        <>
          <LaborSection labor={labor} companyId={companyId!} />
          <LiabilitySection
            policies={insurancePolicies}
            companyId={companyId!}
          />
          <TravelFeeSection travelFee={travelFee} />
          <CreditCardFeeSection creditCardFee={creditCardFee} />
          <FeesSection fees={fees} companyId={companyId!} />
        </>
      );
      break;
    }
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default RatesTab;
