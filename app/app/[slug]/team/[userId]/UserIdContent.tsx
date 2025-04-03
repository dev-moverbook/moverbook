"use client";

import { useState, useEffect } from "react";
import { UserSchema } from "@/types/convex-schemas";
import { ClerkRoleLabels, ClerkRoles } from "@/types/enums";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import { useDeleteUser } from "@/app/hooks/useDeleteUser";
import { useReactivateUser } from "@/app/hooks/useReactivateUser";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import ConfirmDeleteUserModal from "./components/ConfirmDeleteUserModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import RoleSelectField from "@/app/components/shared/RoleSelectField";
import { Button } from "@/app/components/ui/button";

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

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSave = async () => {
    const success = await updateUser(user._id, {
      name: formData.name,
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
      role: formData.role as ClerkRoles,
    });
    if (success) setIsEditing(false);
  };

  const handleDelete = async () => {
    const success = await deleteUser(user._id);
    if (success) setIsDeleteModalOpen(false);
  };

  const handleReactivate = async () => {
    await reactivateUser(user._id);
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="User Info"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

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

          <FieldRow
            label="Hourly Rate"
            name="hourlyRate"
            value={formData.hourlyRate}
            isEditing={isEditing}
            onChange={handleChange}
          />

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

          {!isEditing && (
            <div className="flex space-x-4 mt-4">
              {user.isActive ? (
                <Button
                  className="text-sm text-red-500"
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="destructive"
                >
                  Delete
                </Button>
              ) : (
                <button
                  className="text-sm text-green-600"
                  onClick={handleReactivate}
                  disabled={reactivateLoading}
                >
                  Reactivate
                </button>
              )}
            </div>
          )}

          {reactivateError && (
            <p className="text-red-500 text-sm mt-2">{reactivateError}</p>
          )}
        </FieldGroup>

        <ConfirmDeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteError(null);
          }}
          onConfirm={handleDelete}
          deleteLoading={deleteLoading}
          deleteError={deleteError}
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default UserIdContent;
