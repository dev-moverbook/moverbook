import React from "react";
import { useCompanyInventoryData } from "@/app/hooks/queries/useCompanyInventoryData";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { QueryStatus } from "@/types/enums";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import InventorySection from "./InventorySection";

const ViewInventory = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const result = useCompanyInventoryData(move.companyId);

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;
    case QueryStatus.ERROR:
      content = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS: {
      const { items, categories, rooms } = result.data;
      content = (
        <InventorySection items={items} categories={categories} rooms={rooms} />
      );
    }
  }

  return content;
};

export default ViewInventory;
