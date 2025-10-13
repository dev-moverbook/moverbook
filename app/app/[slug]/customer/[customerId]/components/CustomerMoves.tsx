"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import CardContainer from "@/app/components/shared/CardContainer";
import { Plus } from "lucide-react";
import Link from "next/link";
import MoveOnlyCard from "@/app/components/move/MoveOnlyCard";
import { useState } from "react";
import DuplicateMoveModal from "../modals/DuplicateMoveModal";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";
import type { Doc } from "@/convex/_generated/dataModel";
import type { EnrichedMoveForMover } from "@/types/convex-responses";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";

interface CustomerMovesProps {
  moves: EnrichedMoveForMover[];
  moveCustomer: Doc<"moveCustomers">;
}

export default function CustomerMoves({
  moves,
  moveCustomer,
}: CustomerMovesProps) {
  const { slug, user } = useSlugContext();
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const addMoveHref = `/app/${slug}/add-move?moveCustomerId=${moveCustomer._id}`;

  const handleDuplicateMove = (move: Doc<"move">) => {
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
