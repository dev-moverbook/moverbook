"use client";

import { useState, useCallback } from "react";

export function useDuplicateSelection() {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  const toggleSwap = useCallback(() => {
    setIsSwapped((previous) => !previous);
  }, []);

  return {
    selectedSections,
    setSelectedSections,
    isSwapped,
    toggleSwap,
  };
}
