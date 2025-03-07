"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { UserSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import { useDeleteUser } from "@/app/hooks/useDeleteUser";
import { useReactivateUser } from "@/app/hooks/useReactivateUser";
import { ClerkRoles } from "@/types/enums";
import ConfirmDeleteUserModal from "./components/ConfirmDeleteUserModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormState {
  name: string;
  email: string;
  hourlyRate: string;
  role: ClerkRoles | ""; // Ensure role is typed properly
}

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const id = userId as Id<"users">;

  const userResponse = useQuery(api.users.getUserById, { userId: id });
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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<UserFormState>({
    name: "",
    email: "",
    hourlyRate: "",
    role: "", // Ensure it can handle an empty initial state
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (userResponse && userResponse.status !== ResponseStatus.ERROR) {
      const user = userResponse.data.user as UserSchema;
      setFormState({
        name: user.name,
        email: user.email,
        hourlyRate: user.hourlyRate !== null ? String(user.hourlyRate) : "",
        role: user.role || "", // Handle potential undefined roles
      });
    }
  }, [userResponse]);

  if (!userResponse) return <div>Loading...</div>;
  if (userResponse.status === ResponseStatus.ERROR)
    return <div>Error: {userResponse.error}</div>;

  const user = userResponse.data.user as UserSchema;

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    const success = await updateUser(user._id, {
      name: formState.name,
      hourlyRate: formState.hourlyRate ? Number(formState.hourlyRate) : null,
      role: formState.role as ClerkRoles, // Ensure the role is properly passed
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteUser(user._id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  const handleReactivate = async () => {
    await reactivateUser(user._id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Name:</label>
            <Input
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium">Email:</label>
            <Input
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium">Hourly Rate:</label>
            <Input
              value={formState.hourlyRate}
              onChange={(e) =>
                setFormState({ ...formState, hourlyRate: e.target.value })
              }
              placeholder="Enter hourly rate"
            />
          </div>
          <div>
            <label className="block font-medium">Role:</label>
            <Select
              value={formState.role}
              onValueChange={(value: ClerkRoles) =>
                setFormState({ ...formState, role: value as ClerkRoles })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ClerkRoles.MANAGER}>Manager</SelectItem>
                <SelectItem value={ClerkRoles.MOVER}>Mover</SelectItem>
                <SelectItem value={ClerkRoles.SALES_REP}>Sales Rep</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleSave} disabled={updateLoading}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleEditToggle}>
              Cancel
            </Button>
          </div>
          {updateError && <p className="text-red-500">{updateError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Hourly Rate:</strong>{" "}
            {user.hourlyRate !== null ? user.hourlyRate : "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.isActive ? "Active" : "Deleted"}
          </p>
          <div className="flex space-x-4">
            <Button onClick={handleEditToggle}>Edit</Button>
            {user.isActive ? (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleReactivate}
                disabled={reactivateLoading}
              >
                Reactivate
              </Button>
            )}
          </div>
          {reactivateError && <p className="text-red-500">{reactivateError}</p>}
        </div>
      )}
      <ConfirmDeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDelete}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
    </div>
  );
};

export default UserPage;
