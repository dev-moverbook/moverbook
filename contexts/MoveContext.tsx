"use client";

import { createContext, useContext } from "react";
import { GetMoveData } from "@/types/convex-responses";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  moveId,
}: {
  children: React.ReactNode;
  moveId: Id<"moves">;
}) => {
  const moveData = useQuery(api.moves.getMoveContext, { moveId });

  if (!moveData) {
    return;
  }

  return (
    <MoveContext.Provider value={{ moveData }}>{children}</MoveContext.Provider>
  );
};
