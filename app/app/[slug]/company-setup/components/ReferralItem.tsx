"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { useUpdateReferral } from "../hooks/useUpdateReferral";
import { useDeleteReferral } from "../hooks/useDeleteReferral";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

import { Pencil, Trash2, Save, X } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import IconRow from "@/app/components/shared/IconRow";
import ListItemRow from "@/app/components/shared/ListItemRow";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(name);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { updateReferral, updateLoading, updateError, setUpdateError } =
    useUpdateReferral();
  const { deleteReferral, deleteLoading, deleteError } = useDeleteReferral();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      setUpdateError(FrontEndErrorMessages.REFERARAL_NAME_REQUIRED);
      return;
    }

    const success = await updateReferral(referralId, { name: editedName });
    if (success) {
      setIsEditing(false);
    }
  };

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
