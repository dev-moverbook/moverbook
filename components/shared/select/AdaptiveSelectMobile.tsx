"use client";

import { Option } from "@/types/types";
import AdaptiveSelectOptionsList from "./AdaptiveSelectOptionsList";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface AdaptiveSelectMobileProps {
  allIcon?: React.ReactNode;
  allValue?: string;
  description: string;
  emptyText?: string;
  onChange: (value: string | null) => void;
  open: boolean;
  options: Option[];
  searchPlaceholder?: string;
  setOpen: (open: boolean) => void;
  showSearch?: boolean;
  title?: string;
  value: string | null;
}

export default function AdaptiveSelectMobile({
  allIcon,
  allValue,
  description,
  emptyText,
  onChange,
  open,
  options,
  searchPlaceholder,
  setOpen,
  showSearch = true,
  title,
  value,
}: AdaptiveSelectMobileProps) {
  const handleOptionPick = (nextValue: string | null) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent
        className="flex flex-col bg-black text-white"
        heightVh={90}
        style={{ overscrollBehavior: "contain", touchAction: "manipulation" }}
      >
        <DrawerHeader className="flex-shrink-0 pb-2">
          <DrawerTitle className="text-white">{title}</DrawerTitle>
        </DrawerHeader>

        <div
          className="flex-1 overflow-y-auto"
          style={{
            paddingBottom:
              "calc(env(safe-area-inset-bottom) + var(--kb, 0px) + 72px)",
          }}
        >
          <DrawerDescription className="px-4">{description}</DrawerDescription>

          <AdaptiveSelectOptionsList
            allIcon={allIcon}
            allValue={allValue}
            emptyText={emptyText}
            listMaxH="max-h-[56vh]"
            onPick={handleOptionPick}
            options={options}
            searchPlaceholder={searchPlaceholder}
            showSearch={showSearch}
            value={value}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
