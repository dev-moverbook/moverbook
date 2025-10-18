"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useDeleteReferral } from "@/hooks/referrals";
import ConfirmDeleteModal from "@/components/company-setup/modals/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";
import IconButton from "@/components/shared/IconButton";
import IconRow from "@/components/shared/IconRow";
import ListItemRow from "@/components/shared/ListItemRow";

interface ReferralItemProps {
  referralId: Id<"referrals">;
  name: string;
  onEdit: (id: Id<"referrals">, name: string) => void;
}

const ReferralItem: React.FC<ReferralItemProps> = ({
  referralId,
  name,
  onEdit,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { deleteReferral, deleteLoading, deleteError } = useDeleteReferral();

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteReferral(referralId);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <ListItemRow>
        <span className="font-medium">{name}</span>
        <IconRow>
          <IconButton
            onClick={() => onEdit(referralId, name)}
            icon={<Pencil className="w-4 h-4" />}
            title="Edit"
          />
          <IconButton
            onClick={handleDeleteClick}
            icon={<Trash2 className="w-4 h-4" />}
            variant="outline"
            disabled={deleteLoading}
            title="Delete"
          />
        </IconRow>
      </ListItemRow>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
    </>
  );
};

export default ReferralItem;
