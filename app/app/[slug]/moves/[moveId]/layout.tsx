"use client";

import { useParams } from "next/navigation";
import { useMoveContext } from "@/app/hooks/queries/useMoveContext";
import { Id } from "@/convex/_generated/dataModel";
import { MoveProvider } from "@/app/contexts/MoveContext";
import FullLoading from "@/app/components/shared/FullLoading";

const MoveLayout = ({ children }: { children: React.ReactNode }) => {
  const { moveId } = useParams();
  const data = useMoveContext(moveId as Id<"move">);

  if (!data) {
    return <FullLoading />;
  }

  return <MoveProvider value={{ moveData: data }}>{children}</MoveProvider>;
};

export default MoveLayout;
