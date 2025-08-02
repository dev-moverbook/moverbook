"use client";

import { useState } from "react";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { Doc } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import LabeledMoveCheckboxGroup from "@/app/components/shared/labeled/LabeledMoveCheckboxGroup";
import {
  formatCurrency,
  formatJobRate,
  formatServiceTypeName,
} from "@/app/frontendUtils/helper";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";

interface DuplicateMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  move: Doc<"move">;
}

const DuplicateMoveModal: React.FC<DuplicateMoveModalProps> = ({
  isOpen,
  onClose,
  move,
}) => {
  const router = useRouter();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  const { slug } = useParams();
  const baseUrl = `/app/${slug}/add-move`;

  const handleClose = () => onClose();

  const handleSubmit = () => {
    const params = new URLSearchParams();

    params.set("moveCustomerId", move.moveCustomerId);

    if (selectedSections.length > 0) {
      params.set("duplicateFrom", move._id);
      params.set("fields", selectedSections.join(","));
    }

    router.push(`${baseUrl}?${params.toString()}`);
    handleClose();
  };

  const handleSwapLocations = () => {
    setIsSwapped((prev) => !prev);
  };

  const getStartAddress = (m: Doc<"move">) =>
    !isSwapped
      ? (m.locations[0]?.address ?? "—")
      : (m.locations[m.locations.length - 1]?.address ?? "—");

  const getEndAddress = (m: Doc<"move">) =>
    !isSwapped
      ? (m.locations[m.locations.length - 1]?.address ?? "—")
      : (m.locations[0]?.address ?? "—");

  const sectionOptions = [
    {
      label: "Type of Service",
      value: "serviceType",
      getValue: (m: Doc<"move">) =>
        m.serviceType ? formatServiceTypeName(m.serviceType) : "—",
    },
    {
      label: "Starting Location",
      value: "startingLocation",
      getValue: getStartAddress,
    },
    {
      label: "Ending Location",
      value: "endingLocation",
      getValue: getEndAddress,
    },
    {
      label: "Stops",
      value: "stops",
      getValue: (m: Doc<"move">) =>
        m.locations.length > 2 ? `${m.locations.length - 2} stops` : "None",
    },
    {
      label: "Inventory",
      value: "inventory",
      getValue: (m: Doc<"move">) =>
        m.moveItems.length > 0 ? `${m.moveItems.length} items` : "None",
    },
    {
      label: "Movers",
      value: "movers",
      getValue: (m: Doc<"move">) => `${m.movers} movers`,
    },
    {
      label: "Trucks",
      value: "trucks",
      getValue: (m: Doc<"move">) => `${m.trucks} trucks`,
    },
    {
      label: "Rate",
      value: "rate",
      getValue: (m: Doc<"move">) => formatJobRate(m.jobType, m.jobTypeRate),
    },
    {
      label: "Add Ons",
      value: "addOns",
      getValue: (m: Doc<"move">) =>
        m.moveFees.length > 0 ? `${m.moveFees.length} items` : "None",
    },
    {
      label: "Liability Coverage",
      value: "liabilityCoverage",
      getValue: (m: Doc<"move">) => m.liabilityCoverage?.name ?? "Not selected",
    },
  ];

  const formContent = (
    <FieldGroup>
      <LabeledMoveCheckboxGroup
        label="Duplicate Move Details"
        name="duplicateSections"
        values={selectedSections}
        options={sectionOptions.map((option) => ({
          ...option,
          getValue: (m: Doc<"move">) => {
            const value = option.getValue(m);
            return value;
          },
        }))}
        move={move}
        onChange={setSelectedSections}
        onSwap={handleSwapLocations}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        saveLabel="Duplicate"
        cancelLabel="Cancel"
        disabled={!move.moveCustomerId}
      />
    </FieldGroup>
  );

  const description =
    "Choose the details you want to duplicate in the new move.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Duplicate Move"
      description={description}
      children={formContent}
    />
  );
};

export default DuplicateMoveModal;
