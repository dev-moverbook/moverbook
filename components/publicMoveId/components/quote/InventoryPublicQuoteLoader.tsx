"use client";

import { MoveItemInput } from "@/types/form-types";
import EditableQuoteInventory from "./EditableQuoteInventory";
import { useCompanyInventoryData } from "@/hooks/items";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";

interface InventoryPublicQuoteLoaderProps {
  initialItems: MoveItemInput[];
  onItemsChange: (items: MoveItemInput[] | undefined) => void;
}

const InventoryPublicQuoteLoader = ({
  initialItems,
  onItemsChange,
}: InventoryPublicQuoteLoaderProps) => {
  const { move } = usePublicMoveIdContext();
  const { companyId } = move.move;
  const data = useCompanyInventoryData(companyId);

  if (!data) {
    return null;
  }

  const { items, categories, rooms } = data;

  return (
    <EditableQuoteInventory
      initialItems={initialItems}
      onItemsChange={onItemsChange}
      items={items}
      categories={categories}
      rooms={rooms}
    />
  );
};

export default InventoryPublicQuoteLoader;
