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
import { ItemSchema } from "@/types/convex-schemas";
import { ItemFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";
import { CategorySize } from "@/types/convex-enums";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    categoryId: Id<"categories">,
    itemData: ItemFormData
  ) => Promise<boolean>;
  onEdit: (itemId: Id<"items">, itemData: ItemFormData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  categoryId: Id<"categories">;
  initialData?: ItemSchema | null;
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  categoryId,
  initialData,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    size: "",
    isPopular: false,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        size: initialData.size,
        isPopular: initialData.isPopular,
      });
    } else {
      setFormData({
        name: "",
        size: "",
        isPopular: false,
      });
    }
    setValidationError(null);
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPopular: checked,
    }));
  };

  const handleSizeSelect = (size: CategorySize) => {
    setFormData((prev) => ({
      ...prev,
      size,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError(FrontEndErrorMessages.ITEM_NAME_REQUIRED);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (initialData) {
      await onEdit(initialData._id, formData);
    } else {
      await onCreate(companyId, categoryId, formData);
    }

    onClose();
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Item Name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter item name"
        />
      </div>

      {/* Size Selection */}
      <div>
        <Label className="block text-sm font-medium">Size</Label>
        <div className="flex gap-2">
          {Object.values(CategorySize).map((size) => (
            <Button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`px-3 py-1 rounded ${
                formData.size === size
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {size}
            </Button>
          ))}
        </div>
        <div className="mt-2">
          <Label className="block text-sm font-medium">Custom Size</Label>
          <Input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            placeholder="Enter custom size if needed"
          />
        </div>
      </div>

      {/* Popular Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPopular"
          checked={formData.isPopular}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="isPopular" className="text-sm">
          Mark as Popular Item
        </Label>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Save Changes" : "Add Item"}
      </Button>
      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Edit Item" : "Add Item"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Edit Item" : "Add Item"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
