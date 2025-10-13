import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useUserById = (userId: Id<"users">): Doc<"users"> | undefined => {
  const response = useQuery(api.users.getUserById, { userId });

  return response;
};
