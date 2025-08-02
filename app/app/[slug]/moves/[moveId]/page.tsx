"use client";

import MoveContent from "./MoveContent";
import { useMoveContext } from "@/app/contexts/MoveContext";
import FullLoading from "@/app/components/shared/FullLoading";

const MoveIdPage = () => {
  const { moveData } = useMoveContext();

  if (!moveData) return <FullLoading />;

  return <MoveContent />;
};

export default MoveIdPage;
