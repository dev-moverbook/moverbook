// app/(whatever)/GuidelinesTab.tsx
"use client";

import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import ArrivalWindowSection from "../sections/ArrivalWindowSection";
import PolicySection from "../sections/PolicySection";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import { useCompanyArrivalAndPolicies } from "@/app/hooks/queries/arrivalWindow/UseCompanyArrivalAndPolicies";

const GuidelinesTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyArrivalAndPolicies(companyId);

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorComponent message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS: {
      const { arrivalWindow, policy } = result.data;
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
