"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type TabSelectorProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
};

const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const [tabWidth, setTabWidth] = useState(0);

  useEffect(() => {
    if (tabs.length > 0) {
      setTabWidth(100 / tabs.length);
    }
  }, [tabs.length]);

  const activeIndex = tabs.findIndex((tab) => tab === activeTab);

  return (
    <div className={cn("relative border-b border-grayCustom", className)}>
      <div className="relative z-10 max-w-screen-sm mx-auto">
        <div className="flex w-full relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={(e) => {
                e.preventDefault();
                onTabChange(tab);
              }}
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

          {/* Sliding underline INSIDE the button container */}
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
    </div>
  );
};

export default TabSelector;
