import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import DisplayInventory from "./DisplayInventory";
import SelectionInventory from "./SelectionInventory";
import { useCompanyInventoryData } from "@/app/hooks/queries/useCompanyInventoryData";
import { Id } from "@/convex/_generated/dataModel";
import DataLoader from "@/app/components/shared/containers/DataLoader";

interface InventoryProps {
  onNext: () => void;
  onBack: () => void;
  companyId: Id<"companies">;
}

const Inventory = ({ onNext, onBack, companyId }: InventoryProps) => {
  const { data, isLoading, isError, errorMessage } =
    useCompanyInventoryData(companyId);

  return (
    <DataLoader
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      data={data}
    >
      {(data) => (
        <SectionContainer>
          <Header3>Inventory</Header3>
          <DisplayInventory />
          <SelectionInventory data={data} />

          <FormActions
            onSave={onNext}
            onCancel={onBack}
            isSaving={false}
            saveLabel="Next"
            cancelLabel="Back"
          />
        </SectionContainer>
      )}
    </DataLoader>
  );
};

export default Inventory;
