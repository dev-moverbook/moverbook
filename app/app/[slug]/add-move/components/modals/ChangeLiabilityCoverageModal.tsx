import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import { InsurancePolicySchema } from "@/types/convex-schemas";

interface ChangeLiabilityCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverage?: InsurancePolicySchema[];
}

const ChangeLiabilityCoverageModal = ({
  isOpen,
  onClose,
  coverage,
}: ChangeLiabilityCoverageModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const handleSubmit = () => {
    console.log();
  };

  const handleClose = () => {
    onClose();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  const formContent = (
    <FieldGroup>
      <FieldRow label="Price" name="price" type="number" />

      <FormActions
        onSave={handleSubmit}
        onCancel={onClose}
        saveLabel="Save"
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{"Change Liability Coverage"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{"Change Liability Coverage"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeLiabilityCoverageModal;
