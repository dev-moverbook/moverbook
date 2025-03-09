"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import GuidelinesTab from "./tabs/GuidelinesTab";
import RatesTab from "./tabs/RatesTab";
import InventoryTab from "./tabs/InventoryTab";

const MoveSetUpPage = () => {
  const [activeTab, setActiveTab] = useState<
    "guidelines" | "rates" | "inventory"
  >("guidelines");

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-4">Move Setup</h1>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b pb-2">
        <Button
          variant={activeTab === "guidelines" ? "default" : "outline"}
          onClick={() => setActiveTab("guidelines")}
        >
          Guidelines
        </Button>
        <Button
          variant={activeTab === "rates" ? "default" : "outline"}
          onClick={() => setActiveTab("rates")}
        >
          Rates
        </Button>
        <Button
          variant={activeTab === "inventory" ? "default" : "outline"}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "guidelines" && <GuidelinesTab />}
        {activeTab === "rates" && <RatesTab />}
        {activeTab === "inventory" && <InventoryTab />}
      </div>
    </div>
  );
};

export default MoveSetUpPage;
