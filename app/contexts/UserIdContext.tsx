"use client";

import { Id } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type UserId = { userId: Id<"users"> };

const UserIdContext = createContext<UserId | null>(null);

export function UserIdProvider({
  userId,
  children,
}: {
  userId: Id<"users">;
  children: React.ReactNode;
}) {
  return (
    <UserIdContext.Provider value={{ userId }}>
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
