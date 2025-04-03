"use client";

import React, { useState } from "react";
import GeneralTab from "./tabs/GeneralTab";
import ReferralsTab from "./tabs/ReferralsTab";
import ScriptsTab from "./tabs/ScriptsTab";
import TabSelector from "@/app/components/shared/TabSelector";
import SectionTitle from "@/app/components/shared/SectionTitle";
import TabContentContainer from "@/app/components/shared/TabContentContainer";

const CompanySetupPage = () => {
  const [activeTab, setActiveTab] = useState<string>("GENERAL");

  return (
    <main>
      <SectionTitle>Company Setup</SectionTitle>
      <TabSelector
        tabs={["GENERAL", "SCRIPTS", "REFERRALS"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContentContainer>
        {activeTab === "GENERAL" && <GeneralTab />}
        {activeTab === "SCRIPTS" && <ScriptsTab />}
        {activeTab === "REFERRALS" && <ReferralsTab />}
      </TabContentContainer>
    </main>
  );
};

export default CompanySetupPage;
