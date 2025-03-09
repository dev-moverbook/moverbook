"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { ResponseStatus } from "@/types/enums";
import ArrivalWindowSection from "../sections/ArrivalWindowSection";
import PolicySection from "../sections/PolicySection";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ErrorComponent from "@/app/components/shared/ErrorComponent";

const GuidelinesTab = () => {
  const { companyId } = useSlugContext();

  const queryResult = useQuery(
    api.arrivalWindow.getCompanyArrivalAndPolicies,
    companyId ? { companyId } : "skip"
  );

  if (!queryResult || !companyId) {
    return <RenderSkeleton />;
  }

  if (queryResult.status === ResponseStatus.ERROR) {
    return <ErrorComponent message={queryResult.error} />;
  }

  const { arrivalWindow, policy } = queryResult.data;

  return (
    <div className="p-4 space-y-6">
      <ArrivalWindowSection arrivalWindow={arrivalWindow} />{" "}
      <PolicySection policy={policy} />
    </div>
  );
};

export default GuidelinesTab;
