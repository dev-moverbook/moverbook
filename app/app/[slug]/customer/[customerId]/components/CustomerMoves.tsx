"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import CardContainer from "@/app/components/shared/CardContainer";
import { Plus } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import MoveOnlyCard from "@/app/components/move/MoveOnlyCard";
import { useState } from "react";
import DuplicateMoveModal from "../modals/DuplicateMoveModal";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";

interface CustomerMovesProps {
  moves: Doc<"move">[];
  moveCustomer: Doc<"moveCustomers">;
}

const CustomerMoves: React.FC<CustomerMovesProps> = ({
  moves,
  moveCustomer,
}) => {
  const router = useRouter();
  const { slug } = useParams();

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const handleAddMove = () => {
    router.push(`/app/${slug}/add-move?moveCustomerId=${moveCustomer._id}`);
  };

  const handleDuplicateMove = (move: Doc<"move">) => {
    setSelectedMove(move);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  return (
    <SectionContainer className="px-0 gap-0 pb-20 " showBorder={false}>
      <SectionHeaderWithAction
        title="Moves"
        action={
          <Button variant="outline" onClick={handleAddMove}>
            <div className="flex items-center gap-1">
              <Plus className="w-5 h-5" />
              Move
            </div>
          </Button>
        }
        className="font-bold"
      />

      {moves.length > 0 && (
        <CardContainer>
          {moves.map((move, index) => (
            <MoveOnlyCard
              key={`${move.jobId}-${index}`}
              move={move}
              showActions={true}
              onDuplicate={handleDuplicateMove}
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
};

export default CustomerMoves;
