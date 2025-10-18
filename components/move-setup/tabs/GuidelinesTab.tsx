"use client";

import VerticalSectionGroup from "@/components/shared/VerticalSectionGroup";
import ArrivalWindowSection from "../sections/ArrivalWindowSection";
import PolicySection from "../sections/PolicySection";
import { useSlugContext } from "@/contexts/SlugContext";
import { useCompanyArrivalAndPolicies } from "@/hooks/arrivalWindow/UseCompanyArrivalAndPolicies";

const GuidelinesTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyArrivalAndPolicies(companyId);

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = null;
      break;

    default: {
      const { arrivalWindow, policy } = result;
      content = (
        <>
          <ArrivalWindowSection arrivalWindow={arrivalWindow} />
          <PolicySection policy={policy} />
        </>
      );
      break;
    }
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default GuidelinesTab;
