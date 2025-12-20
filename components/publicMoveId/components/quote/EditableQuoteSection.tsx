"use client";

import QuoteInventory from "@/components/moveId/components/quote/QuoteInventory";
import QuoteLocation from "@/components/moveId/components/quote/QuoteLocation";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { isMoveCustomerFromClerk } from "@/frontendUtils/permissions";
import { useState } from "react";
import EditQuoteFormActions from "./EditQuoteFormActions";
import MoveDetailsHeading from "./MoveDetailsHeading";
import MoveDetailsEditingHeading from "./MoveDetailsEditingHeading";
import { LocationInput, MoveItemInput } from "@/types/form-types";
import EditableQuoteLocation from "./EditableQuoteLocation";
import InventoryPublicQuoteLoader from "./InventoryPublicQuoteLoader";

const EditableQuoteSection = () => {
  const { move, userRole } = usePublicMoveIdContext();
  const { move: moveData } = move;
  const isMoveCustomer = isMoveCustomerFromClerk(userRole);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [requestedLocations, setRequestedLocations] = useState<
    LocationInput[] | undefined
  >();
  const [requestedMoveItems, setRequestedMoveItems] = useState<
    MoveItemInput[] | undefined
  >();

  const handleEditClick = () => {
    setRequestedLocations(undefined);
    setRequestedMoveItems(undefined);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRequestedLocations(undefined);
    setRequestedMoveItems(undefined);
  };

  if (isEditing) {
    return (
      <>
        <MoveDetailsEditingHeading onCancel={handleCancel} />

        <EditableQuoteLocation
          initialLocations={moveData.locations ?? []}
          onLocationsChange={setRequestedLocations}
        />
        <InventoryPublicQuoteLoader
          initialItems={moveData.moveItems ?? []}
          onItemsChange={setRequestedMoveItems}
        />

        <EditQuoteFormActions
          onCancel={handleCancel}
          requestedLocations={requestedLocations}
          requestedMoveItems={requestedMoveItems}
        />
      </>
    );
  }

  return (
    <>
      <MoveDetailsHeading
        onEditClick={isMoveCustomer ? handleEditClick : undefined}
      />
      <QuoteLocation move={moveData} />
      <QuoteInventory move={moveData} />
    </>
  );
};

export default EditableQuoteSection;
