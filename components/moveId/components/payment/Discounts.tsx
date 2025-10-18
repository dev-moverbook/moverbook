"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import { Button } from "@/components/ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateDiscount } from "../../../../hooks/discounts/useCreateDiscount";
import { useUpdateDiscount } from "../../../../hooks/discounts/useUpdateDiscount";
import DiscountModal, { DiscountFormData } from "../modals/DiscountModal";
import CardContainer from "@/components/shared/card/CardContainer";
import DiscountCard from "../card/DiscountCard";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";

interface DiscountsProps {
  discounts: Doc<"discounts">[];
  moveId: Id<"move">;
}

const Discounts = ({ discounts, moveId }: DiscountsProps) => {
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
  const [editDiscount, setEditDiscount] = useState<Doc<"discounts"> | null>(
    null
  );
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

  const handleSubmitDiscount = async (discount: DiscountFormData) => {
    const { name, price } = discount;
    if (!price) {
      setCreateDiscountError("Price is required");
      return;
    }
    if (!editDiscount) {
      const response = await createDiscount({
        moveId,
        name,
        price,
      });
      if (response) {
        handleCloseDiscountModal();
      }
    } else {
      const response = await updateDiscount({
        discountId: editDiscount._id,
        updates: {
          name,
          price,
        },
      });
      if (response) {
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
    const match: Doc<"discounts"> | undefined = discounts.find(
      (d) => d._id === discount
    );
    if (match) {
      setEditDiscount(match);
    }
    setShowDiscountModal(true);
  };

  const handleDeleteDiscount = (discount: Id<"discounts">) => {
    setShowDeleteModal(true);
    setDiscountToDelete(discount);
    setEditDiscount(null);
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
    if (response) {
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
        {discounts.length > 0 ? (
          <CardContainer>
            {discounts.map((discount) => (
              <DiscountCard
                key={discount._id}
                discount={discount}
                onEdit={handleEditDiscount}
                onDelete={handleDeleteDiscount}
              />
            ))}
          </CardContainer>
        ) : (
          <p className="text-grayCustom2">No discounts added.</p>
        )}
      </SectionContainer>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteDiscount}
        deleteLoading={updateDiscountLoading}
        deleteError={updateDiscountError}
        title="Confirm Delete"
        description="Are you sure you want to delete this discount?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />

      <DiscountModal
        isOpen={showDiscountModal}
        onClose={handleCloseDiscountModal}
        onSubmit={handleSubmitDiscount}
        initialData={editDiscount ? editDiscount : null}
        isLoading={editDiscount ? updateDiscountLoading : createDiscountLoading}
        errorMessage={editDiscount ? updateDiscountError : createDiscountError}
      />
    </div>
  );
};

export default Discounts;
