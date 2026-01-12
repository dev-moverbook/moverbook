"use client";

import { createContext, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { PublicMoveData } from "@/types/convex-responses";
import { useUser } from "@clerk/nextjs";
import ErrorMessage from "@/components/shared/error/ErrorMessage";

interface PublicMoveIdContextType {
  move: PublicMoveData;
  userRole: string;
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
  console.log("initialMoveId", moveId);
  const move = useQuery(api.moves.getPublicMoveById, { moveId });
  const { user, isLoaded } = useUser();

  console.log("user", user);
  console.log("move", move);

  if (!move || !isLoaded) {
    return <FullLoading />;
  }

  if (user === null) {
    return <ErrorMessage message="You must be signed in to view this page." />;
  }
  const userRole = user.publicMetadata.role as string;

  return (
    <PublicMoveIdContext.Provider
      value={{
        move,
        userRole,
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
