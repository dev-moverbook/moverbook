"use client";

import SelectDrawer from "./SelectDrawer";
import { useMediaQuery } from "react-responsive";
import SelectPopover from "./SelectPopover";
import { MOBILE_BREAKPOINT } from "@/types/const";

type ResponsiveSelectOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function ResponsiveSelectOverlay({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}: ResponsiveSelectOverlayProps) {
  const isMobileViewport = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  if (isMobileViewport) {
    return (
      <>
        {trigger}
        <SelectDrawer
          open={open}
          onOpenChange={onOpenChange}
          title={title}
          description={description}
        >
          {children}
        </SelectDrawer>
      </>
    );
  }

  return (
    <SelectPopover open={open} onOpenChange={onOpenChange} trigger={trigger}>
      {children}
    </SelectPopover>
  );
}
