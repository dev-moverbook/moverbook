"use client";

import React, { useState } from "react";
import GuidelinesTab from "./tabs/GuidelinesTab";
import RatesTab from "./tabs/RatesTab";
import InventoryTab from "./tabs/InventoryTab";
import SectionTitle from "@/app/components/shared/SectionTitle";
import TabContentContainer from "@/app/components/shared/TabContentContainer";
import TabSelector from "@/app/components/shared/TabSelector";

const MoveSetUpPage = () => {
  const [activeTab, setActiveTab] = useState<string>("GUIDELINES");

  return (
    <main>
      <SectionTitle>Move Setup</SectionTitle>
      <TabSelector
        tabs={["GUIDELINES", "RATES", "INVENTORY"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContentContainer>
        {activeTab === "GUIDELINES" && <GuidelinesTab />}
        {activeTab === "RATES" && <RatesTab />}
        {activeTab === "INVENTORY" && <InventoryTab />}
      </TabContentContainer>
    </main>
  );
};

export default MoveSetUpPage;
