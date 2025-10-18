"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import VerticalSectionGroup from "@/components/shared/section/VerticalSectionGroup";
import LaborSection from "../sections/LaborSection";
import LiabilitySection from "../sections/LiabilitySection";
import TravelFeeSection from "../sections/TravelFeeSection";
import FeesSection from "../sections/FeesSection";
import CreditCardFeeSection from "../sections/CreditCardFeeSection";
import { useCompanyRates } from "@/hooks/labor/useCompanyRates";

const RatesTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyRates(companyId);

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = null;
      break;

    default:
      const { labor, insurancePolicies, travelFee, creditCardFee, fees } =
        result;

      content = (
        <>
          <LaborSection labor={labor} />
          <LiabilitySection policies={insurancePolicies} />
          <TravelFeeSection travelFee={travelFee} />
          <CreditCardFeeSection creditCardFee={creditCardFee} />
          <FeesSection fees={fees} companyId={companyId!} />
        </>
      );
      break;
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default RatesTab;
