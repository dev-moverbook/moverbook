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
    if (tabs.length > 0) {
      setTabWidth(100 / tabs.length);
    }
  }, [tabs.length]);

  const activeIndex = tabs.findIndex((tab) => tab === activeTab);

  return (
    <div className="relative">
      {/* Border line on both sides outside of the centered area */}
      <div className="absolute left-0 right-0 top-full h-px bg-gray-700 z-0" />

      <div className="relative z-10 max-w-2xl mx-auto ">
        <div className="flex w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 text-center py-1 font-medium transition-colors",
                activeTab === tab
                  ? "text-white"
                  : "text-grayCustom hover:text-white"
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
    </div>
  );
};

export default TabSelector;
