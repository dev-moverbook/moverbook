"use client";

import { useMove } from "@/app/hooks/queries/useMove";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import MoveContent from "./MoveContent";

const MoveIdPage = () => {
  const { moveId } = useParams();

  const { data, isLoading, isError, errorMessage } = useMove(
    moveId as Id<"move">
  );

  if (isLoading) {
    return <FullLoading />;
  }

  if (isError || !data) {
    return <ErrorComponent message={errorMessage ?? "Move not found"} />;
  }

  if (data) {
    return <MoveContent moveData={data} />;
  }

  return <ErrorComponent message="Move not found" />;
};

export default MoveIdPage;
