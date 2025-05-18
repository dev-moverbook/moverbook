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
import MonthDayPicker from "@/app/components/shared/MonthDayPicker";

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
    startDate: null,
    endDate: null,
  });

  const [startMonth, setStartMonth] = useState("none");
  const [startDay, setStartDay] = useState("none");
  const [endMonth, setEndMonth] = useState("none");
  const [endDay, setEndDay] = useState("none");

  const [errors, setErrors] = useState<{
    name?: string;
    twoMovers?: string;
    threeMovers?: string;
    fourMovers?: string;
    extra?: string;
    startDate?: string;
    endDate?: string;
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
        startDate: initialData.startDate,
        endDate: initialData.endDate,
      });

      if (initialData.startDate) {
        const month = Math.floor(initialData.startDate / 100).toString();
        const day = (initialData.startDate % 100).toString();
        setStartMonth(month);
        setStartDay(day);
      }

      if (initialData.endDate) {
        const month = Math.floor(initialData.endDate / 100).toString();
        const day = (initialData.endDate % 100).toString();
        setEndMonth(month);
        setEndDay(day);
      }
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
      startDate: null,
      endDate: null,
    });
    setStartMonth("none");
    setStartDay("none");
    setEndMonth("none");
    setEndDay("none");
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
      startDate?: string;
      endDate?: string;
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
      if (error) errors[key] = error;
    }

    if (!formData.isDefault) {
      if (startMonth === "none" || startDay === "none") {
        errors.startDate = FrontEndErrorMessages.START_DATE_REQUIRED;
      }
      if (endMonth === "none" || endDay === "none") {
        errors.endDate = FrontEndErrorMessages.END_DATE_REQUIRED;
      }

      if (
        startMonth !== "none" &&
        startDay !== "none" &&
        endMonth !== "none" &&
        endDay !== "none"
      ) {
        const computedStart = parseInt(startMonth) * 100 + parseInt(startDay);
        const computedEnd = parseInt(endMonth) * 100 + parseInt(endDay);
        if (computedStart > computedEnd) {
          errors.startDate = FrontEndErrorMessages.START_DATE_AFTER_END_DATE;
        }
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const computedStartDate =
      startMonth !== "none" && startDay !== "none"
        ? parseInt(startMonth) * 100 + parseInt(startDay)
        : null;

    const computedEndDate =
      endMonth !== "none" && endDay !== "none"
        ? parseInt(endMonth) * 100 + parseInt(endDay)
        : null;

    const updatedLabor: CreateLaborFormData = {
      ...labor,
      startDate: computedStartDate,
      endDate: computedEndDate,
    };

    const validationErrors = validateLaborForm(updatedLabor);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const success = initialData
      ? await onEdit(initialData._id, updatedLabor)
      : await onCreate(companyId, updatedLabor);

    if (success) handleClose();
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
      <div className="grid grid-cols-2 gap-4">
        <FieldRow
          label="Two Movers Rate"
          name="twoMovers"
          type="number"
          value={labor.twoMovers.toString()}
          onChange={handleInputChange}
          placeholder="Enter rate for two movers"
          error={errors.twoMovers}
          min={0}
        />
        <FieldRow
          label="Three Movers Rate"
          name="threeMovers"
          type="number"
          value={labor.threeMovers.toString()}
          onChange={handleInputChange}
          placeholder="Enter rate for three movers"
          error={errors.threeMovers}
          min={0}
        />
        <FieldRow
          label="Four Movers Rate"
          name="fourMovers"
          type="number"
          value={labor.fourMovers.toString()}
          onChange={handleInputChange}
          placeholder="Enter rate for four movers"
          error={errors.fourMovers}
          min={0}
        />
        <FieldRow
          label="Extra Rate"
          name="extra"
          type="number"
          value={labor.extra.toString()}
          onChange={handleInputChange}
          placeholder="Enter extra rate"
          error={errors.extra}
          min={0}
        />
      </div>

      {!initialData?.isDefault && (
        <>
          <MonthDayPicker
            label="Start Date"
            month={startMonth}
            day={startDay}
            onChange={(m, d) => {
              setStartMonth(m);
              setStartDay(d);
            }}
            error={errors.startDate}
          />
          <MonthDayPicker
            label="End Date"
            month={endMonth}
            day={endDay}
            onChange={(m, d) => {
              setEndMonth(m);
              setEndDay(d);
            }}
            error={errors.endDate}
          />
        </>
      )}

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
