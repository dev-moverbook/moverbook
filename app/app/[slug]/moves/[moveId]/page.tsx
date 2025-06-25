"use client";

import MoveContent from "./MoveContent";
import { useMoveContext } from "@/app/contexts/MoveContext";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorComponent from "@/app/components/shared/ErrorComponent";

const MoveIdPage = () => {
  const { moveData } = useMoveContext();

  if (!moveData) return <FullLoading />;

  return <MoveContent moveData={moveData} />;
};

export default MoveIdPage;
