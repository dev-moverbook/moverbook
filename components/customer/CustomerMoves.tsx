"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import CardContainer from "@/components/shared/card/CardContainer";
import { Plus } from "lucide-react";
import Link from "next/link";
import MoveOnlyCard from "@/components/move/MoveOnlyCard";
import { useState } from "react";
import DuplicateMoveModal from "./modals/DuplicateMoveModal";
import { useSlugContext } from "@/contexts/SlugContext";
import { isMover } from "@/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";
import type { Doc } from "@/convex/_generated/dataModel";
import type { EnrichedMoveForMover } from "@/types/convex-responses";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import { CustomerUser } from "@/types/types";

interface CustomerMovesProps {
  moves: EnrichedMoveForMover[];
  moveCustomer: CustomerUser;
}

export default function CustomerMoves({
  moves,
  moveCustomer,
}: CustomerMovesProps) {
  const { slug, user } = useSlugContext();
  const isMoverUser = isMover(user.role as ClerkRoles);

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"moves"> | null>(null);

  const addMoveHref = `/app/${slug}/add-move?moveCustomerId=${moveCustomer._id}&referral=repeat`;

  const handleDuplicateMove = (move: Doc<"moves">) => {
    setSelectedMove(move);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  const actionNode = isMoverUser ? null : (
    <Button asChild variant="outline">
      <Link href={addMoveHref}>
        <span className="flex items-center gap-1">
          <Plus className="w-5 h-5" />
          Move
        </span>
      </Link>
    </Button>
  );

  return (
    <SectionContainer className="px-0 gap-0 pb-20" showBorder={false}>
      <SectionHeaderWithAction
        title="Moves"
        action={actionNode}
        className="font-bold"
      />

      {moves.length > 0 && (
        <CardContainer>
          {moves.map((move) => (
            <MoveOnlyCard
              key={move._id}
              move={move}
              showActions={!isMoverUser}
              onDuplicate={handleDuplicateMove}
              href={`/app/${slug}/moves/${move._id}`}
            />
          ))}
        </CardContainer>
      )}

      {selectedMove && isDuplicateMoveModalOpen && (
        <DuplicateMoveModal
          isOpen={isDuplicateMoveModalOpen}
          onClose={handleCloseDuplicateMoveModal}
          move={selectedMove}
        />
      )}
    </SectionContainer>
  );
}
