"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import {
  LocationType,
  MoveAnalyticsPoint,
  MoveSize,
  ServiceType,
} from "@/types/types";

export const useMoveAnalytics = (
  companyId: Id<"companies">,
  startDate: string,
  endDate: string,
  serviceType: ServiceType | null,
  moveSize: MoveSize | null,
  numberOfMovers: number | null,
  locationType: LocationType | null
): MoveAnalyticsPoint[] | undefined => {
  const response = useQuery(api.move.getMoveAnalytics, {
    companyId,
    startDate,
    endDate,
    serviceType,
    moveSize,
    numberOfMovers,
    locationType,
  });

  return response;
};
