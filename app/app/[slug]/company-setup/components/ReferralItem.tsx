"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useUpdateReferral } from "../hooks/useUpdateReferral";
import { useDeleteReferral } from "../hooks/useDeleteReferral";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

interface ReferralItemProps {
  referralId: Id<"referrals">;
  name: string;
}

const ReferralItem: React.FC<ReferralItemProps> = ({ referralId, name }) => {
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
      <li className="flex justify-between items-center p-3 border rounded-md">
        {isEditing ? (
          <Input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          <span className="font-medium">{name}</span>
        )}

        <div className="flex space-x-2">
          {isEditing ? (
            <Button onClick={handleSave} disabled={updateLoading}>
              {updateLoading ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button onClick={handleEditClick}>Edit</Button>
          )}

          <Button
            variant="destructive"
            onClick={handleDeleteClick}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </div>

        {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
      </li>

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
