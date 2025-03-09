"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { InsurancePolicyFormData } from "@/types/form-types";

interface LiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    policyData: InsurancePolicyFormData
  ) => Promise<boolean>;
  onEdit: (
    policyId: Id<"insurancePolicies">,
    policyData: InsurancePolicyFormData
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: InsurancePolicySchema | null;
}

const LiabilityModal: React.FC<LiabilityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  initialData,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile devices
  const [formData, setFormData] = useState<InsurancePolicyFormData>({
    name: "",
    coverageAmount: 0,
    coverageType: 0,
    premium: 0,
    isDefault: false,
  });

  // Populate form data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        coverageAmount: initialData.coverageAmount,
        coverageType: initialData.coverageType,
        premium: initialData.premium,
        isDefault: initialData.isDefault,
      });
    }
  }, [initialData]);

  // Reset form data when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        coverageAmount: 0,
        coverageType: 0,
        premium: 0,
        isDefault: false,
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (initialData) {
      await onEdit(initialData._id, formData);
    } else {
      await onCreate(companyId, formData);
    }

    onClose();
  };

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="coverageAmount" className="text-right">
          Coverage Amount
        </Label>
        <Input
          id="coverageAmount"
          name="coverageAmount"
          type="number"
          value={formData.coverageAmount}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="coverageType" className="text-right">
          Coverage Type
        </Label>
        <Input
          id="coverageType"
          name="coverageType"
          type="number"
          value={formData.coverageType}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="premium" className="text-right">
          Premium
        </Label>
        <Input
          id="premium"
          name="premium"
          type="number"
          value={formData.premium}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="isDefault">Is Default</Label>
      </div>
      <Button disabled={loading} onClick={handleSubmit} className="w-full mt-4">
        {loading ? "Saving..." : initialData ? "Save Changes" : "Add Policy"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Edit Policy" : "Add Policy"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>{initialData ? "Edit Policy" : "Add Policy"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default LiabilityModal;
