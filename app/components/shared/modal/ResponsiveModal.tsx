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
import React from "react";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Height in vh for the DrawerContent (mobile) */
  heightVh?: number;
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  heightVh = 80,
}) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent {...(heightVh ? { heightVh } : {})}>
        <DrawerTitle>{title}</DrawerTitle>
        {description && <DrawerDescription>{description}</DrawerDescription>}
        {children}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;
