"use client";

import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useSlugContext } from "@/contexts/SlugContext";
import DuplicateMoveForm from "./DuplicateMoveForm";
import { useDuplicateSelection } from "./useDuplicateSelection";
import { buildSectionOptions, buildDuplicateMoveUrl } from "./utils";

interface DuplicateMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  move: Doc<"move">;
}

export default function DuplicateMoveModal({
  isOpen,
  onClose,
  move,
}: DuplicateMoveModalProps) {
  const router = useRouter();
  const { slug } = useSlugContext();

  const { selectedSections, setSelectedSections, isSwapped, toggleSwap } =
    useDuplicateSelection();

  const baseUrl = `/app/${slug}/add-move`;
  const options = buildSectionOptions(isSwapped);
  const submitDisabled = !move.moveCustomerId;

  function handleSubmit() {
    const href = buildDuplicateMoveUrl(baseUrl, move, selectedSections);
    router.push(href);
    onClose();
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Move"
      description="Choose the details you want to duplicate in the new move."
      heightVh={95}
    >
      <DuplicateMoveForm
        move={move}
        options={options}
        selectedSections={selectedSections}
        onChangeSelected={setSelectedSections}
        onSwap={toggleSwap}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitDisabled={submitDisabled}
      />
    </ResponsiveModal>
  );
}
