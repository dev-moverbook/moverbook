"use client";

import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FormActions from "@/app/components/shared/FormActions";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteLoading: boolean;
  deleteError: string | null;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deleteLoading,
  deleteError,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const content = (
    <div className="space-y-4">
      <p>Are you sure you want to delete this referral?</p>

      <FormActions
        onSave={onConfirm}
        onCancel={onClose}
        isSaving={deleteLoading}
        saveLabel="Delete"
        cancelLabel="Cancel"
        error={deleteError}
        saveVariant="destructive"
        cancelVariant="whiteGhost"
      />
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>Confirm Delete</DrawerTitle>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Confirm Delete</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
