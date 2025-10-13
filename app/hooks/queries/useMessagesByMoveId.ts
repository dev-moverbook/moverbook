// app/hooks/queries/messages/useMessagesByMoveId.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useMessagesByMoveId = (
  moveId: Id<"move">
): Doc<"messages">[] | undefined => {
  const response = useQuery<typeof api.messages.getMessagesByMoveId>(
    api.messages.getMessagesByMoveId,
    { moveId }
  );

  return response;
};
