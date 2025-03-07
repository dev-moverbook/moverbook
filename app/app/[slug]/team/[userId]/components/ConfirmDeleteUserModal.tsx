"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/app/components/ui/button";

interface ConfirmDeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteLoading: boolean;
  deleteError: string | null;
}

const ConfirmDeleteUserModal: React.FC<ConfirmDeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deleteLoading,
  deleteError,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const content = (
    <div className="space-y-4">
      <p>Are you sure you want to delete this user?</p>
      <Button onClick={onConfirm} className="w-full" disabled={deleteLoading}>
        Delete
      </Button>
      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>Delete User</DrawerTitle>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Delete User</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteUserModal;
