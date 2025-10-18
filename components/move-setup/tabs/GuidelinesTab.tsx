"use client";

import VerticalSectionGroup from "@/components/shared/VerticalSectionGroup";
import ArrivalWindowSection from "../sections/ArrivalWindowSection";
import PolicySection from "../sections/PolicySection";
import { useSlugContext } from "@/contexts/SlugContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const GuidelinesTab = () => {
  const { companyId } = useSlugContext();
  const result = useQuery<
    typeof api.arrivalWindow.getCompanyArrivalAndPolicies
  >(api.arrivalWindow.getCompanyArrivalAndPolicies, {
    companyId,
  });
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
