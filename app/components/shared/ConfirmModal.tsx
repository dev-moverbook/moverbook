"use client";

import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { MOBILE_BREAKPOINT } from "@/types/const";
import FormActions from "./FormActions";
import ResponsiveModal from "./modal/ResponsiveModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteLoading: boolean;
  deleteError: string | null;
  // Customizable texts
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deleteLoading,
  deleteError,

  // Default texts for reusability
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this action?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const content = (
    <div className="space-y-4 ">
      <FormActions
        onSave={onConfirm}
        onCancel={onClose}
        saveVariant="destructive"
        saveLabel={confirmButtonText}
        cancelLabel={cancelButtonText}
        isSaving={deleteLoading}
        error={deleteError}
        cancelVariant="whiteGhost"
      />
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      children={content}
    />
  );
};

export default ConfirmModal;
