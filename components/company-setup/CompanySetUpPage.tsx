"use client";

import React, { useState } from "react";
import GeneralTab from "./tabs/GeneralTab";
import ReferralsTab from "./tabs/ReferralsTab";
import ScriptsTab from "./tabs/ScriptsTab";
import TabSelector from "@/components/shared/tab/TabSelector";
import SectionTitle from "@/components/shared/section/SectionTitle";
import TabContentContainer from "@/components/shared/containers/TabContentContainer";

const CompanySetupPage = () => {
  const [activeTab, setActiveTab] = useState<string>("GENERAL");

  return (
    <>
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
    </>
  );
};

export default CompanySetupPage;
