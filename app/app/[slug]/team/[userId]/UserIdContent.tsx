"use client";

import { useState } from "react";
import { ClerkRoles } from "@/types/enums";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import { useDeleteUser } from "@/app/hooks/useDeleteUser";
import { useReactivateUser } from "@/app/hooks/useReactivateUser";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import RoleSelectField from "@/app/components/shared/RoleSelectField";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Image from "next/image";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { Doc } from "@/convex/_generated/dataModel";
import BackCenteredHeader from "@/app/components/shared/heading/BackCenteredHeader";
import { canManageCompany } from "@/app/frontendUtils/permissions";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface Props {
  userData: Doc<"users">;
  onBack: () => void;
}

type UserFormState = {
  name: string;
  email: string;
  hourlyRate: number | null;
  role: string;
};

const UserIdContent: React.FC<Props> = ({ userData, onBack }) => {
  const {
    updateUser,
    loading: updateLoading,
    error: updateError,
  } = useUpdateUser();
  const {
    deleteUser,
    loading: deleteLoading,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteUser();
  const {
    reactivateUser,
    loading: reactivateLoading,
    error: reactivateError,
  } = useReactivateUser();

  const { user } = useSlugContext();

  const isCompanyManagerPermission = canManageCompany(
    user?.publicMetadata.role as string
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<UserFormState>({
    name: userData.name || "",
    email: userData.email || "",
    hourlyRate: userData.hourlyRate !== undefined ? userData.hourlyRate : null,
    role: userData.role || "",
  });

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      hourlyRate:
        userData.hourlyRate !== undefined ? userData.hourlyRate : null,
      role: userData.role || "",
    });
    setDeleteError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateUser(userData._id, {
      name: formData.name,
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
      role: formData.role as ClerkRoles,
    });
    if (success) setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUser(userData._id);
    if (success) setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  const handleReactivate = async () => {
    await reactivateUser(userData._id);
  };

  const isDisabled =
    formData.name.trim() === "" ||
    formData.email.trim() === "" ||
    formData.role.trim() === "" ||
    formData.hourlyRate === null;

  return (
    <>
      <BackCenteredHeader
        title="User Info"
        onBack={onBack}
        onEditClick={
          isCompanyManagerPermission && userData.isActive
            ? handleEditClick
            : undefined
        }
        onDeleteClick={
          isCompanyManagerPermission && userData.isActive
            ? () => setIsDeleteModalOpen(true)
            : undefined
        }
        rightExtra={
          !userData.isActive && isCompanyManagerPermission ? (
            <Button
              size="sm"
              onClick={handleReactivate}
              disabled={reactivateLoading}
            >
              Reactivate
            </Button>
          ) : null
        }
        isEditing={isEditing}
        onCancelEdit={handleCancel}
      />

      {userData.imageUrl && (
        <div className="w-full flex justify-center my-2">
          <Image
            src={userData.imageUrl}
            alt={userData.name}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </div>
      )}

      <FieldGroup>
        <FieldRow
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Name"
          isEditing={false}
        />

        <FieldRow
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isEditing={false}
        />

        {formData.role === ClerkRoles.MOVER && (
          <CurrencyInput
            label="Hourly Rate"
            value={formData.hourlyRate}
            onChange={(value: number | null) =>
              setFormData((prev) => ({
                ...prev,
                hourlyRate: value || null,
              }))
            }
            isEditing={isEditing}
            suffix="/hr"
          />
        )}

        <RoleSelectField
          value={formData.role as ClerkRoles}
          isEditing={false}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, role: val as ClerkRoles }))
          }
        />

        <div>
          <Label className="block  font-medium mb-1">Status</Label>
          <p className=" text-grayCustom2">
            {userData.isActive ? "Active" : "Deleted"}
          </p>
        </div>

        {isEditing && isCompanyManagerPermission && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateLoading}
            error={updateError}
            disabled={isDisabled}
          />
        )}

        {reactivateError && (
          <p className="text-red-500 text-sm mt-2">{reactivateError}</p>
        )}
      </FieldGroup>

      {isCompanyManagerPermission && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={deleteLoading}
          deleteError={deleteError}
          title="Confirm Delete"
          description="Are you sure you want to delete this user? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};

export default UserIdContent;
