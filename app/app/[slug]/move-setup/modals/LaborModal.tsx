"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FrontEndErrorMessages } from "@/types/errors";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateLaborFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import { LaborSchema } from "@/types/convex-schemas";

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
  const [nameError, setNameError] = useState<string | null>(null);

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
    setNameError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!labor.name?.trim()) {
      setNameError(FrontEndErrorMessages.LABOR_NAME_REQUIRED);
      return;
    }

    let success = false;

    if (initialData) {
      // Edit mode
      success = await onEdit(initialData._id, labor);
    } else {
      // Create mode
      success = await onCreate(companyId, labor);
    }

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
    if (name === "name") setNameError(null);
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Labor Name</Label>
        <Input
          type="text"
          name="name"
          value={labor.name}
          onChange={handleInputChange}
          placeholder="Enter labor name"
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>

      <div>
        <Label className="block text-sm font-medium">Two Movers Rate</Label>
        <Input
          type="number"
          name="twoMovers"
          value={labor.twoMovers}
          onChange={handleInputChange}
          placeholder="Enter rate for two movers"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Three Movers Rate</Label>
        <Input
          type="number"
          name="threeMovers"
          value={labor.threeMovers}
          onChange={handleInputChange}
          placeholder="Enter rate for three movers"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Four Movers Rate</Label>
        <Input
          type="number"
          name="fourMovers"
          value={labor.fourMovers}
          onChange={handleInputChange}
          placeholder="Enter rate for four movers"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Extra Rate</Label>
        <Input
          type="number"
          name="extra"
          value={labor.extra}
          onChange={handleInputChange}
          placeholder="Enter extra rate"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          name="isDefault"
          checked={labor.isDefault}
          onCheckedChange={(checked) =>
            setLabor((prev) => ({ ...prev, isDefault: checked as boolean }))
          }
        />
        <Label htmlFor="isDefault">Is Default</Label>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Update Labor" : "Create Labor"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
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
