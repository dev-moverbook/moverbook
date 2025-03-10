"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { ResponseStatus } from "@/types/enums";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import RoomSection from "../sections/RoomSection";
import CategorySection from "../sections/CategorySection";

const InventoryTab = () => {
  const { companyId } = useSlugContext();

  const queryResult = useQuery(
    api.rooms.getActiveRoomsByCompany,
    companyId ? { companyId } : "skip"
  );

  const categoryResult = useQuery(
    api.categories.getTopLevelCategories,
    companyId ? { companyId } : "skip"
  );

  if (!queryResult || !companyId || !categoryResult) {
    return <RenderSkeleton />;
  }

  if (queryResult.status === ResponseStatus.ERROR) {
    return <ErrorComponent message={queryResult.error} />;
  }

  if (categoryResult.status === ResponseStatus.ERROR) {
    return <ErrorComponent message={categoryResult.error} />;
  }

  const { rooms } = queryResult.data;

  return (
    <div className="p-4 space-y-6">
      <RoomSection rooms={rooms} companyId={companyId} />
      <CategorySection
        categories={categoryResult.data.categories}
        companyId={companyId}
      />
    </div>
  );
};

export default InventoryTab;
