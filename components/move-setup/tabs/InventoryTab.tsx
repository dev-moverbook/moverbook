"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import VerticalSectionGroup from "@/components/shared/section/VerticalSectionGroup";
import RoomSection from "../sections/RoomSection";
import ItemSection from "../sections/ItemSection";
import ResetSection from "../sections/ResetSection";
import { useCompanyInventoryData } from "@/hooks/items";

const InventoryTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyInventoryData(companyId);

  let content: React.ReactNode;

  switch (result) {
    case undefined:
      content = null;
      break;

    default: {
      const { items, categories, rooms } = result;
      content = (
        <>
          <RoomSection rooms={rooms} companyId={companyId!} />
          <ItemSection
            items={items}
            categories={categories}
            companyId={companyId!}
          />
          <ResetSection companyId={companyId!} />
        </>
      );
      break;
    }
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default InventoryTab;
