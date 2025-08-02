"use client";

import { useParams } from "next/navigation";
import { useMove } from "@/app/hooks/queries/useMove";
import { Id } from "@/convex/_generated/dataModel";
import { MoveProvider } from "@/app/contexts/MoveContext";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorComponent from "@/app/components/shared/ErrorComponent";

const MoveLayout = ({ children }: { children: React.ReactNode }) => {
  const { moveId } = useParams();
  const { data, isLoading, isError, errorMessage } = useMove(
    moveId as Id<"move">
  );

  if (isLoading) return <FullLoading />;
  if (isError || !data)
    return <ErrorComponent message={errorMessage ?? "Move not found"} />;

  return <MoveProvider value={{ moveData: data }}>{children}</MoveProvider>;
};

export default MoveLayout;
