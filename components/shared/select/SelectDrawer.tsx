"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

type SelectDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function SelectDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
}: SelectDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="flex flex-col bg-black text-white"
        heightVh={90}
        style={{ overscrollBehavior: "contain", touchAction: "manipulation" }}
      >
        <DrawerHeader className="flex-shrink-0 pb-2">
          <DrawerTitle className="text-white">{title}</DrawerTitle>
          <DrawerDescription className="text-white/70">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
