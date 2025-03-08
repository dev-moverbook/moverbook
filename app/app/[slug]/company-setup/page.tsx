"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import GeneralTab from "./tabs/GeneralTab";
import ReferralsTab from "./tabs/ReferralsTab";
import ScriptsTab from "./tabs/ScriptsTab";

const Page = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "referrals" | "scripts"
  >("general");

  return (
    <div className="p-4">
      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b pb-2">
        <Button
          variant={activeTab === "general" ? "default" : "outline"}
          onClick={() => setActiveTab("general")}
        >
          General
        </Button>

        <Button
          variant={activeTab === "scripts" ? "default" : "outline"}
          onClick={() => setActiveTab("scripts")}
        >
          Scripts
        </Button>
        <Button
          variant={activeTab === "referrals" ? "default" : "outline"}
          onClick={() => setActiveTab("referrals")}
        >
          Referrals
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "general" && <GeneralTab />}
        {activeTab === "scripts" && <ScriptsTab />}
        {activeTab === "referrals" && <ReferralsTab />}
      </div>
    </div>
  );
};

export default Page;
