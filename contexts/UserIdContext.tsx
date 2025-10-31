"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { createContext, useContext } from "react";

type UserId = { userId: Id<"users">; user: Doc<"users"> };

const UserIdContext = createContext<UserId | null>(null);

export function UserIdProvider({
  userId,
  children,
}: {
  userId: Id<"users">;
  children: React.ReactNode;
}) {
  const user = useQuery(api.users.getUserById, { userId });

  if (!user) {
    return;
  }

  return (
    <UserIdContext.Provider value={{ userId, user }}>
      {children}
    </UserIdContext.Provider>
  );
}

export function useUserId(): UserId {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error("UserIdProvider missing");
  }

  return context;
}
