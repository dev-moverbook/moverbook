"use client";

import { MoveFilterProvider } from "@/app/contexts/MoveFilterContext";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MoveFilterProvider>{children}</MoveFilterProvider>;
}
