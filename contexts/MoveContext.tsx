"use client";

import { createContext, useContext } from "react";
import { GetMoveData } from "@/types/convex-responses";

interface MoveContextValue {
  moveData: GetMoveData;
}

const MoveContext = createContext<MoveContextValue | undefined>(undefined);

export const useMoveContext = () => {
  const ctx = useContext(MoveContext);
  if (!ctx) {
    throw new Error("useMoveContext must be used inside MoveProvider");
  }
  return ctx;
};

export const MoveProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MoveContextValue;
}) => {
  return <MoveContext.Provider value={value}>{children}</MoveContext.Provider>;
};
