"use client";

import { useState } from "react";
import { UserSchema } from "@/types/convex-schemas";
import { ClerkRoles } from "@/types/enums";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import { useDeleteUser } from "@/app/hooks/useDeleteUser";
import { useReactivateUser } from "@/app/hooks/useReactivateUser";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import RoleSelectField from "@/app/components/shared/RoleSelectField";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Image from "next/image";

interface Props {
  user: UserSchema;
}

type UserFormState = {
  name: string;
  email: string;
  hourlyRate: string;
  role: string;
};

const UserIdContent: React.FC<Props> = ({ user }) => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<UserFormState>({
    name: user.name || "",
    email: user.email || "",
    hourlyRate: user.hourlyRate !== null ? String(user.hourlyRate) : "",
    role: user.role || "",
  });

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      hourlyRate: user.hourlyRate !== null ? String(user.hourlyRate) : "",
      role: user.role || "",
    });
    setDeleteError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateUser(user._id, {
      name: formData.name,
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
      role: formData.role as ClerkRoles,
    });
    if (success) setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUser(user._id);
    if (success) setIsDeleteModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  const handleReactivate = async () => {
    await reactivateUser(user._id);
  };

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader
          title="User Info"
          onEditClick={user.isActive ? handleEditClick : undefined}
          onDeleteClick={
            user.isActive ? () => setIsDeleteModalOpen(true) : undefined
          }
          id={user._id}
          actions={
            !user.isActive && (
              <Button
                size="sm"
                onClick={handleReactivate}
                disabled={reactivateLoading}
              >
                Reactivate
              </Button>
            )
          }
        />
        {user.imageUrl && (
          <div className="w-full flex justify-center mb-4">
            <Image
              src={user.imageUrl}
              alt={user.name}
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
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Email"
            name="email"
            value={formData.email}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {formData.role === ClerkRoles.MOVER && (
            <FieldRow
              label="Hourly Rate"
              name="hourlyRate"
              value={formData.hourlyRate}
              isEditing={isEditing}
              onChange={handleChange}
            />
          )}

          <RoleSelectField
            value={formData.role as ClerkRoles}
            isEditing={isEditing}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, role: val as ClerkRoles }))
            }
          />

          <div>
            <Label className="block text-sm font-medium mb-1">Status</Label>
            <p className="text-sm text-grayCustom2">
              {user.isActive ? "Active" : "Deleted"}
            </p>
          </div>

          {isEditing && (
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={updateLoading}
              error={updateError}
            />
          )}

          {reactivateError && (
            <p className="text-red-500 text-sm mt-2">{reactivateError}</p>
          )}
        </FieldGroup>

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
      </CenteredContainer>
    </SectionContainer>
  );
};

export default UserIdContent;
