"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/app/components/ui/button";

interface ResponsiveRevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  revokeLoading: boolean;
  revokeError: string | null;
}

const ResponsiveRevokeModal: React.FC<ResponsiveRevokeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  revokeLoading,
  revokeError,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const content = (
    <div className="space-y-4">
      <p>Are you sure you want to revoke this user?</p>
      <Button onClick={onConfirm} className="w-full" disabled={revokeLoading}>
        {revokeLoading ? "Revoking..." : "Confirm Revoke"}
      </Button>
      {revokeError && <p className="text-red-500 text-sm">{revokeError}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>Revoke User</DrawerTitle>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Revoke User</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveRevokeModal;
