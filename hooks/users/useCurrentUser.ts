import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export const useCurrentUser = (): Doc<"users"> | undefined => {
  const response = useQuery<typeof api.users.getUserByClerkId>(
    api.users.getUserByClerkId
  );

  return response;
};
