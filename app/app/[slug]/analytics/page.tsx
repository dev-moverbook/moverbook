"use client";

import TabSelector from "@/app/components/shared/TabSelector";
import React, { useState } from "react";
import AnalyticsMoves from "./tabs/AnalyticsMoves";
import AnalyticsTab from "./tabs/AnalyticsTab";

const AnalyticsPage = () => {
  const tabs = ["FORECASTED", "HISTORICAL", "MOVES"];
  const [activeTab, setActiveTab] = useState<string>("FORECASTED");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <main className="pb-20">
      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mt-4"
      />
      {(activeTab === "FORECASTED" || activeTab === "HISTORICAL") && (
        <AnalyticsTab tab={activeTab} />
      )}

      {activeTab === "MOVES" && <AnalyticsMoves />}
    </main>
  );
};

export default AnalyticsPage;
