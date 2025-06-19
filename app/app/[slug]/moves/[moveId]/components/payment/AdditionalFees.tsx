"use client";

import { Id } from "@/convex/_generated/dataModel";

import CardContainer from "@/app/components/shared/CardContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import { Button } from "@/app/components/ui/button";
import { AdditionalFeeSchema } from "@/types/convex-schemas";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateAdditionalFee } from "../../../hooks/useCreteAdditionalFee";
import { useUpdateAdditionalFee } from "../../../hooks/useUpdateAdditionalFee";
import ConfirmDeleteModal from "@/app/app/[slug]/company-setup/modals/ConfirmDeleteModal";
import AdditionalFeeCard from "../card/AdditionalFeeCard";
import AdditionalFeeModal, {
  AdditionalFeeFormData,
} from "../modals/AdditionalFeeModal";

interface AdditionalFeesProps {
  additionalFees: AdditionalFeeSchema[];
  moveId: Id<"move">;
}

const AdditionalFees = ({ additionalFees, moveId }: AdditionalFeesProps) => {
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);
  const [editFee, setEditFee] = useState<AdditionalFeeSchema | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [feeToDelete, setFeeToDelete] = useState<Id<"additionalFees"> | null>(
    null
  );

  const {
    createAdditionalFee,
    createFeeLoading,
    createFeeError,
    setCreateFeeError,
  } = useCreateAdditionalFee();

  const {
    updateAdditionalFee,
    updateFeeLoading,
    updateFeeError,
    setUpdateFeeError,
  } = useUpdateAdditionalFee();

  const handleOpenAddLineItemModal = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setShowAddLineItemModal(true);
  };

  const handleSubmitFee = async (fee: AdditionalFeeFormData) => {
    const parsedPrice = parseFloat(fee.price);
    if (editFee) {
      const response = await updateAdditionalFee({
        additionalFeeId: editFee._id,
        updates: {
          name: fee.name,
          price: parsedPrice,
          quantity: fee.quantity,
          feeId: fee?.feeId,
        },
      });
      if (response.success) {
        handleCloseAddLineItemModal();
      }
    } else {
      const response = await createAdditionalFee({
        moveId: moveId,
        name: fee.name,
        price: parsedPrice,
        quantity: fee.quantity,
        feeId: fee?.feeId,
      });

      if (response.success) {
        handleCloseAddLineItemModal();
      }
    }
  };

  const handleCloseAddLineItemModal = () => {
    setShowAddLineItemModal(false);
    setCreateFeeError(null);
    setUpdateFeeError(null);
  };

  const handleEditFee = (fee: AdditionalFeeSchema) => {
    setEditFee(fee);
    setShowAddLineItemModal(true);
  };

  const handleDeleteFee = (fee: Id<"additionalFees">) => {
    setShowDeleteModal(true);
    setFeeToDelete(fee);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUpdateFeeError(null);
  };

  const handleConfirmDeleteFee = async () => {
    if (!feeToDelete) {
      setUpdateFeeError("Fee not found");
      return;
    }
    const response = await updateAdditionalFee({
      additionalFeeId: feeToDelete,
      updates: {
        isActive: false,
      },
    });
    if (response.success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <div>
      <SectionContainer>
        <Header3
          wrapperClassName="px-0 py-0"
          showCheckmark={false}
          button={
            <Button variant="outline" onClick={handleOpenAddLineItemModal}>
              <div className="flex items-center gap-1">
                <Plus className="w-5 h-5" />
                Fees
              </div>
            </Button>
          }
        >
          Additional Fees
        </Header3>

        {additionalFees.length > 0 ? (
          <CardContainer>
            {additionalFees.map((fee) => (
              <AdditionalFeeCard
                key={fee._id}
                fee={fee}
                onEdit={handleEditFee}
                onDelete={handleDeleteFee}
              />
            ))}
          </CardContainer>
        ) : (
          <p className="text-grayCustom2">No additional fees</p>
        )}
      </SectionContainer>

      <AdditionalFeeModal
        isOpen={showAddLineItemModal}
        onClose={handleCloseAddLineItemModal}
        initialData={editFee ? editFee : null}
        onSubmit={handleSubmitFee}
        moveFeeOptions={[]}
        isLoading={editFee ? updateFeeLoading : createFeeLoading}
        errorMessage={editFee ? updateFeeError : createFeeError}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteFee}
        deleteLoading={updateFeeLoading}
        deleteError={updateFeeError}
      />
    </div>
  );
};

export default AdditionalFees;
