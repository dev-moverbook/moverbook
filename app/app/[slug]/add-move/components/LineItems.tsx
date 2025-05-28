import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import React, { useState } from "react";
import AddLineModal from "./modals/AddLineModal";

const LineItems = () => {
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);

  const handleOpenAddLineItemModal = () => {
    setShowAddLineItemModal(true);
  };

  return (
    <SectionContainer>
      <SectionHeaderWithAction
        title="Line Items"
        action={
          <Button onClick={handleOpenAddLineItemModal}>Add Line Item</Button>
        }
      />
      <AddLineModal
        isOpen={showAddLineItemModal}
        onClose={() => setShowAddLineItemModal(false)}
      />
    </SectionContainer>
  );
};

export default LineItems;
