"use client";

import React, { useState, useEffect } from "react";
import { CreateLaborFormData } from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldRow from "@/components/shared/field/FieldRow";
import MonthDayPicker from "@/components/shared/calendar/MonthDayPicker";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import { LaborCreateInput } from "@/hooks/labors";
import { buildLaborCreateInput } from "@/frontendUtils/transform";

interface LaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    labor: LaborCreateInput
  ) => Promise<boolean>;
  onEdit: (laborId: Id<"labors">, labor: LaborCreateInput) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: Doc<"labors"> | null;
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
  const [labor, setLabor] = useState<CreateLaborFormData>({
    name: "",
    twoMovers: null,
    threeMovers: null,
    fourMovers: null,
    extra: null,
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
      twoMovers: null,
      threeMovers: null,
      fourMovers: null,
      extra: null,
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

    setErrors({});

    const res = buildLaborCreateInput(updatedLabor);
    if (!res.ok) {
      const msg = res.error;
      const nextErrors: typeof errors = {};

      if (/labor name/i.test(msg)) nextErrors.name = msg;
      else if (/start date/i.test(msg)) nextErrors.startDate = msg;
      else if (/end date/i.test(msg)) nextErrors.endDate = msg;
      else if (/two movers/i.test(msg)) nextErrors.twoMovers = msg;
      else if (/three movers/i.test(msg)) nextErrors.threeMovers = msg;
      else if (/four movers/i.test(msg)) nextErrors.fourMovers = msg;
      else if (/extra rate/i.test(msg)) nextErrors.extra = msg;
      else nextErrors.name = msg; // fallback

      setErrors(nextErrors);
      return;
    }

    const payload: LaborCreateInput = res.value;

    const success = initialData
      ? await onEdit(initialData._id, payload)
      : await onCreate(companyId, payload);

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

  const isMissingRates =
    labor.twoMovers === null ||
    labor.threeMovers === null ||
    labor.fourMovers === null ||
    labor.extra === null ||
    labor.name.trim() === "";

  const isMissingDates =
    startMonth === "none" ||
    startDay === "none" ||
    endMonth === "none" ||
    endDay === "none";

  const isDisabled =
    isMissingRates || (!initialData?.isDefault && isMissingDates);

  const isDefault = initialData?.isDefault;

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
        <CurrencyInput
          label="Two Movers Rate"
          value={labor.twoMovers}
          isEditing={true}
          onChange={(value) => {
            setLabor((prev) => ({ ...prev, twoMovers: value ?? null }));
          }}
          error={errors.twoMovers}
        />
        <CurrencyInput
          label="Three Movers Rate"
          value={labor.threeMovers}
          isEditing={true}
          onChange={(value) => {
            setLabor((prev) => ({ ...prev, threeMovers: value ?? null }));
          }}
          error={errors.threeMovers}
        />
        <CurrencyInput
          label="Four Movers Rate"
          value={labor.fourMovers}
          isEditing={true}
          onChange={(value) => {
            setLabor((prev) => ({ ...prev, fourMovers: value ?? null }));
          }}
          error={errors.fourMovers}
        />
        <CurrencyInput
          label="Extra Rate"
          value={labor.extra}
          isEditing={true}
          onChange={(value) => {
            setLabor((prev) => ({ ...prev, extra: value ?? null }));
          }}
          error={errors.extra}
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
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Update Labor" : "Create Labor"}
        cancelLabel="Cancel"
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Labor" : "Create Labor";
  const description = initialData
    ? `Update labor rates${!isDefault ? " and availability window. Make sure the start date is not after the end date" : ""}.`
    : "Enter labor rates for different crew sizes. Set the active start and end dates. Make sure the start date is not after the end date.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
      heightVh={95}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default LaborModal;
