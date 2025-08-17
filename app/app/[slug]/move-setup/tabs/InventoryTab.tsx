"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";
import RoomSection from "../sections/RoomSection";
import ItemSection from "../sections/ItemSection";
import ResetSection from "../sections/ResetSection";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useCompanyInventoryData } from "@/app/hooks/queries/useCompanyInventoryData";
import { QueryStatus } from "@/types/enums";

const InventoryTab = () => {
  const { companyId } = useSlugContext();
  const result = useCompanyInventoryData(companyId);

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorComponent message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS: {
      const { items, categories, rooms } = result.data;
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
