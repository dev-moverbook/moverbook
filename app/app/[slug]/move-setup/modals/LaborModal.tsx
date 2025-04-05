"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FrontEndErrorMessages } from "@/types/errors";
import { CreateLaborFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import { LaborSchema } from "@/types/convex-schemas";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { validatePrice } from "@/app/frontendUtils/validation";
import FieldRow from "@/app/components/shared/FieldRow";
import CheckboxField from "@/app/components/shared/CheckboxField";

interface LaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    labor: CreateLaborFormData
  ) => Promise<boolean>;
  onEdit: (
    laborId: Id<"labor">,
    labor: CreateLaborFormData
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: LaborSchema | null;
}

const LaborModal: React.FC<LaborModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  initialData,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [labor, setLabor] = useState<CreateLaborFormData>({
    name: "",
    twoMovers: 0,
    threeMovers: 0,
    fourMovers: 0,
    extra: 0,
    isDefault: false,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    twoMovers?: string;
    threeMovers?: string;
    fourMovers?: string;
    extra?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setLabor({
        name: initialData.name,
        twoMovers: initialData.twoMovers,
        threeMovers: initialData.threeMovers,
        fourMovers: initialData.fourMovers,
        extra: initialData.extra,
        isDefault: initialData.isDefault,
      });
    } else {
      resetState();
    }
  }, [initialData]);

  const resetState = () => {
    setLabor({
      name: "",
      twoMovers: 0,
      threeMovers: 0,
      fourMovers: 0,
      extra: 0,
      isDefault: false,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateLaborForm = (formData: CreateLaborFormData) => {
    const errors: {
      name?: string;
      twoMovers?: string;
      threeMovers?: string;
      fourMovers?: string;
      extra?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = FrontEndErrorMessages.LABOR_NAME_REQUIRED;
    }

    const rateFields = [
      "twoMovers",
      "threeMovers",
      "fourMovers",
      "extra",
    ] as const;

    for (const key of rateFields) {
      const error = validatePrice(formData[key]);
      if (error) {
        errors[key] = error;
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateLaborForm(labor);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const success = initialData
      ? await onEdit(initialData._id, labor)
      : await onCreate(companyId, labor);

    if (success) {
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLabor((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Labor Name"
        name="name"
        value={labor.name}
        onChange={handleInputChange}
        placeholder="Enter labor name"
        error={errors.name}
      />

      <FieldRow
        label="Two Movers Rate"
        name="twoMovers"
        type="number"
        value={labor.twoMovers.toString()}
        onChange={handleInputChange}
        placeholder="Enter rate for two movers"
        error={errors.twoMovers}
      />

      <FieldRow
        label="Three Movers Rate"
        name="threeMovers"
        type="number"
        value={labor.threeMovers.toString()}
        onChange={handleInputChange}
        placeholder="Enter rate for three movers"
        error={errors.threeMovers}
      />

      <FieldRow
        label="Four Movers Rate"
        name="fourMovers"
        type="number"
        value={labor.fourMovers.toString()}
        onChange={handleInputChange}
        placeholder="Enter rate for four movers"
        error={errors.fourMovers}
      />

      <FieldRow
        label="Extra Rate"
        name="extra"
        type="number"
        value={labor.extra.toString()}
        onChange={handleInputChange}
        placeholder="Enter extra rate"
        error={errors.extra}
      />

      <CheckboxField
        id="isDefault"
        label="Is Default"
        checked={labor.isDefault}
        onChange={(checked) =>
          setLabor((prev) => ({ ...prev, isDefault: checked }))
        }
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Update Labor" : "Create Labor"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Labor" : "Create Labor";

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{title}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default LaborModal;
