import React from "react";
import { useCompanyInventoryData } from "@/hooks/items/useCompanyInventoryData";
import { useMoveContext } from "@/contexts/MoveContext";
import InventorySection from "./InventorySection";

const ViewInventory = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const result = useCompanyInventoryData(move.companyId);

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = null;
      break;
    default: {
      const { items, categories, rooms } = result;
      content = (
        <InventorySection items={items} categories={categories} rooms={rooms} />
      );
    }
  }

  return content;
};

export default ViewInventory;
