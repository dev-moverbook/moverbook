"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { DiscountSchema } from "@/types/convex-schemas";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  CreateDiscountInput,
  useCreateDiscount,
} from "../../../hooks/useCreateDiscount";
import { useUpdateDiscount } from "../../../hooks/useUpdateDiscount";
import ConfirmDeleteModal from "@/app/app/[slug]/company-setup/modals/ConfirmDeleteModal";

interface DiscountsProps {
  discounts: DiscountSchema[];
  moveId: Id<"move">;
}

const Discounts = ({ discounts, moveId }: DiscountsProps) => {
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<Id<"discounts"> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [discountToDelete, setDiscountToDelete] =
    useState<Id<"discounts"> | null>(null);

  const {
    createDiscount,
    createDiscountLoading,
    createDiscountError,
    setCreateDiscountError,
  } = useCreateDiscount();

  const {
    updateDiscount,
    updateDiscountLoading,
    updateDiscountError,
    setUpdateDiscountError,
  } = useUpdateDiscount();

  const handleOpenDiscountModal = () => {
    setShowDiscountModal(true);
  };

  const handleSubmitDiscount = async (discount: CreateDiscountInput) => {
    if (!editIndex) {
      const response = await createDiscount(discount);
      if (response.success) {
        handleCloseDiscountModal();
      }
    } else {
      const response = await updateDiscount({
        discountId: editIndex,
        updates: discount,
      });
      if (response.success) {
        handleCloseDiscountModal();
      }
    }
  };

  const handleCloseDiscountModal = () => {
    setShowDiscountModal(false);
    setCreateDiscountError(null);
    setUpdateDiscountError(null);
  };

  const handleEditDiscount = (discount: Id<"discounts">) => {
    setEditIndex(discount);
    setShowDiscountModal(true);
  };

  const handleDeleteDiscount = (discount: Id<"discounts">) => {
    setShowDeleteModal(true);
    setDiscountToDelete(discount);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUpdateDiscountError(null);
  };

  const handleConfirmDeleteDiscount = async () => {
    if (!discountToDelete) {
      setUpdateDiscountError("Discount not found");
      return;
    }
    const response = await updateDiscount({
      discountId: discountToDelete,
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
            <Button variant="outline" onClick={handleOpenDiscountModal}>
              <div className="flex items-center gap-1">
                <Plus className="w-5 h-5" />
                Discounts
              </div>
            </Button>
          }
        >
          Discounts
        </Header3>
      </SectionContainer>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteDiscount}
        deleteLoading={updateDiscountLoading}
        deleteError={updateDiscountError}
      />
    </div>
  );
};

export default Discounts;
