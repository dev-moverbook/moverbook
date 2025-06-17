"use client";

import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FormMoveItemInput, MoveItemInput } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import FormActions from "@/app/components/shared/FormActions";
import SizeSelector from "@/app/components/shared/labeled/SizeSelector";
import { calculateWeightFromSize } from "@/utils/helper";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { validateMoveItemForm } from "@/app/frontendUtils/validation";

interface SendQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendQuoteModal: React.FC<SendQuoteModalProps> = ({ isOpen, onClose }) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const formContent = <FieldGroup></FieldGroup>;

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>Add Item</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Add Item</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default SendQuoteModal;
