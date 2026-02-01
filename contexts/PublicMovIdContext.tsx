"use client";

import { createContext, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { PublicMoveData } from "@/types/convex-responses";

interface PublicMoveIdContextType {
  move: PublicMoveData;
}

const PublicMoveIdContext = createContext<PublicMoveIdContextType | undefined>(
  undefined
);

export const PublicMoveIdProvider = ({
  initialMoveId: moveId,
  children,
}: {
  initialMoveId: Id<"moves">;
  children: React.ReactNode;
}) => {
  const move = useQuery(api.moves.getPublicMoveById, { moveId });

  if (!move ) {
    return <FullLoading />;
  }

 

  return (
    <PublicMoveIdContext.Provider
      value={{
        move,
      }}
    >
      {children}
    </PublicMoveIdContext.Provider>
  );
};

export const usePublicMoveIdContext = () => {
  const context = useContext(PublicMoveIdContext);
  if (!context) {
    throw new Error(
      "usePublicMoveIdContext must be used within PublicMoveIdProvider"
    );
  }
  return context;
};
