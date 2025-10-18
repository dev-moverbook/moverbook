"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type UserId = { userId: Id<"users">; user: Doc<"users"> };

const UserIdContext = createContext<UserId | null>(null);

export function UserIdProvider({
  userId,
  user,
  children,
}: {
  userId: Id<"users">;
  user: Doc<"users">;
  children: React.ReactNode;
}) {
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
