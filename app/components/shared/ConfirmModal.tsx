"use client";

import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/app/components/ui/button";

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
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const content = (
    <div className="space-y-4">
      <p>{description}</p>

      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={onClose} disabled={deleteLoading}>
          {cancelButtonText}
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={deleteLoading}
        >
          {deleteLoading ? `${confirmButtonText}ing...` : confirmButtonText}
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{title}</DrawerTitle>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
