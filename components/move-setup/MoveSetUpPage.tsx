"use client";

import { useState } from "react";
import GuidelinesTab from "./tabs/GuidelinesTab";
import RatesTab from "./tabs/RatesTab";
import InventoryTab from "./tabs/InventoryTab";
import SectionTitle from "@/components/shared/section/SectionTitle";
import TabContentContainer from "@/components/shared/containers/TabContentContainer";
import TabSelector from "@/components/shared/tab/TabSelector";

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
