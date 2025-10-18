"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRunOnceWhen } from "./useRunOnceWhen";
import { MoveFormData } from "@/types/form-types";

type DuplicateField =
  | "serviceType"
  | "startingLocation"
  | "endingLocation"
  | "stops"
  | "inventory"
  | "movers"
  | "trucks"
  | "rate"
  | "addOns"
  | "liabilityCoverage";

export function useDuplicateFromMove(
  duplicateFromId: string | null,
  fieldsToDuplicate: string[],
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>
) {
  const selectedFields = new Set(fieldsToDuplicate as DuplicateField[]);

  const duplicateSourceMove = useQuery(
    api.move.getMove,
    duplicateFromId ? { moveId: duplicateFromId as Id<"move"> } : "skip"
  );

  useRunOnceWhen(
    Boolean(duplicateSourceMove && selectedFields.size > 0),
    () => {
      const sourceMove = duplicateSourceMove as NonNullable<
        typeof duplicateSourceMove
      >;

      setMoveFormData((previousMoveFormData) => {
        const updatedMoveFormData: MoveFormData = { ...previousMoveFormData };

        if (selectedFields.has("serviceType")) {
          updatedMoveFormData.serviceType = sourceMove.serviceType;
        }

        if (selectedFields.has("startingLocation")) {
          const startingLocation = sourceMove.locations.find(
            (location) => location.locationRole === "starting"
          );

          if (startingLocation) {
            updatedMoveFormData.locations[0] = {
              ...updatedMoveFormData.locations[0],
              ...startingLocation,
            };
          }
        }

        if (selectedFields.has("endingLocation")) {
          const endingLocation = sourceMove.locations.find(
            (location) => location.locationRole === "ending"
          );

          if (endingLocation) {
            updatedMoveFormData.locations[1] = {
              ...updatedMoveFormData.locations[1],
              ...endingLocation,
            };
          }
        }

        if (selectedFields.has("stops")) {
          const stopLocations = sourceMove.locations.filter(
            (location) => location.locationRole === "stop"
          );

          if (stopLocations.length > 0) {
            updatedMoveFormData.locations = [
              ...updatedMoveFormData.locations,
              ...stopLocations,
            ];
          }
        }

        if (selectedFields.has("inventory")) {
          updatedMoveFormData.moveItems = sourceMove.moveItems;
        }

        if (selectedFields.has("movers")) {
          updatedMoveFormData.movers = sourceMove.movers;
        }

        if (selectedFields.has("trucks")) {
          updatedMoveFormData.trucks = sourceMove.trucks;
        }

        if (selectedFields.has("rate")) {
          updatedMoveFormData.jobType = sourceMove.jobType;
          updatedMoveFormData.jobTypeRate = sourceMove.jobTypeRate;
        }

        if (selectedFields.has("addOns")) {
          updatedMoveFormData.moveFees = sourceMove.moveFees;
        }

        if (selectedFields.has("liabilityCoverage")) {
          updatedMoveFormData.liabilityCoverage = sourceMove.liabilityCoverage;
        }

        return updatedMoveFormData;
      });
    }
  );
}
