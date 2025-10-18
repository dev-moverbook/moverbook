"use client";

import React, { useState, useEffect } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { FrontEndErrorMessages } from "@/types/errors";
import FieldGroup from "@/components/shared/FieldGroup";
import FieldRow from "@/components/shared/FieldRow";
import FormActions from "@/components/shared/FormActions";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";

interface CategoryFormData {
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    categoryData: CategoryFormData
  ) => Promise<boolean>;
  onEdit: (
    categoryId: Id<"categories">,
    categoryData: CategoryFormData
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: Doc<"categories"> | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  initialData,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });
  const [fieldError, setFieldError] = useState<{ name?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name });
    } else {
      setFormData({ name: "" });
    }
    setFieldError({});
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFieldError({ name: FrontEndErrorMessages.CATEGORY_NAME_EMPTY });
      return;
    }

    const success = initialData
      ? await onEdit(initialData._id, formData)
      : await onCreate(companyId, formData);

    if (success) {
      onClose();
    }
  };

  const isDisabled = formData.name.trim() === "";

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter category name"
        error={fieldError.name}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={onClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Category"}
        cancelLabel="Cancel"
        disabled={isDisabled}
        cancelVariant="whiteGhost"
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Category" : "Add Category";
  const description = initialData
    ? "Update the category name and save your changes."
    : "Enter a name for the new category you want to add.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      heightVh={95}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default CategoryModal;
