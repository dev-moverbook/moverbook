"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import RoomSection from "../sections/RoomSection";
import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";
import ItemSection from "../sections/ItemSection";
import { useCompanyInventoryData } from "@/app/hooks/queries/useCompanyInventoryData";
import DataLoader from "@/app/components/shared/containers/DataLoader";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ResetSection from "../sections/ResetSection";

const InventoryTab = () => {
  const { companyId } = useSlugContext();

  const { data, isLoading, isError, errorMessage } =
    useCompanyInventoryData(companyId);

  if (!companyId) {
    return <RenderSkeleton />;
  }

  return (
    <DataLoader
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      data={data}
    >
      {({ items, categories, rooms }) => (
        <VerticalSectionGroup>
          <RoomSection rooms={rooms} companyId={companyId} />
          <ItemSection
            items={items}
            companyId={companyId}
            categories={categories}
          />
          <ResetSection companyId={companyId} />
        </VerticalSectionGroup>
      )}
    </DataLoader>
  );
};

export default InventoryTab;
