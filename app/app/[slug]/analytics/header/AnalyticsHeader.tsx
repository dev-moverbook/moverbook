import React, { useMemo } from "react";
import Header2 from "@/app/components/shared/heading/Header2";
import Header3 from "@/app/components/shared/heading/Header3";

interface AnalyticsHeaderProps {
  tab: "FORECASTED" | "HISTORICAL";
  right?: React.ReactNode;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ tab, right }) => {
  const title = useMemo(
    () => (tab === "FORECASTED" ? "Revenue" : "Revenue & Profit"),
    [tab]
  );

  return <Header3 showCheckmark={false}>{title}</Header3>;
};

export default AnalyticsHeader;
