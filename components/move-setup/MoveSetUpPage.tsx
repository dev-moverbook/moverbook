"use client";

import React, { useState } from "react";
import GuidelinesTab from "./tabs/GuidelinesTab";
import RatesTab from "./tabs/RatesTab";
import InventoryTab from "./tabs/InventoryTab";
import SectionTitle from "@/components/shared/SectionTitle";
import TabContentContainer from "@/components/shared/TabContentContainer";
import TabSelector from "@/components/shared/TabSelector";

const MoveSetUpPage = () => {
  const [activeTab, setActiveTab] = useState<string>("GUIDELINES");

  return (
    <>
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
    </>
  );
};

export default MoveSetUpPage;
