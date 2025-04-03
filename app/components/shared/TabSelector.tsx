"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type TabSelectorProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    // Calculate width once based on number of tabs
    if (tabs.length > 0) {
      setTabWidth(100 / tabs.length);
    }
  }, [tabs.length]);

  const activeIndex = tabs.findIndex((tab) => tab === activeTab);

  return (
    <div className="relative w-full">
      <div className="flex w-full">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "flex-1 text-center py-1 font-medium transition-colors border-b",
              activeTab === tab
                ? "border-transparent text-white"
                : "border-gray-700 text-grayCustom hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sliding underline */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-greenCustom rounded"
        animate={{
          width: `${tabWidth}%`,
          left: `${tabWidth * activeIndex}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

export default TabSelector;
