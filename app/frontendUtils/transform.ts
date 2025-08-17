import { ItemFormData, MoveFormData } from "@/types/form-types";

import { CreateMoveInput } from "../app/[slug]/add-move/hooks/createMove";
import { ItemCreateInput } from "../app/[slug]/move-setup/hooks/useCreateItem";

export const transformToCreateMoveInput = (
  form: MoveFormData
): CreateMoveInput => {
  if (!form.companyId) throw new Error("Company ID is required.");
  if (!form.salesRep) throw new Error("Sales Rep is required.");
  if (!form.moveCustomerId) throw new Error("Customer ID is required.");

  return {
    arrivalTimes: form.arrivalTimes,
    companyId: form.companyId,
    creditCardFee: form.creditCardFee ?? null,
    deposit: form.deposit,
    depositMethod: form.deposit > 0 ? form.depositMethod! : null,
    destinationToOrigin: form.destinationToOrigin,
    endingMoveTime: form.endingMoveTime,
    jobType: form.jobType,
    jobTypeRate: form.jobTypeRate,
    liabilityCoverage: form.liabilityCoverage,
    locations: form.locations,
    moveCustomerId: form.moveCustomerId,
    moveDate: form.moveDate,
    moveFees: form.moveFees,
    moveItems: form.moveItems,
    moveStatus: form.moveStatus, // maps to `status` in CreateMoveInput
    moveWindow: form.moveWindow,
    movers: form.movers,
    notes: form.notes
      ? form.notes.trim() === ""
        ? null
        : form.notes.trim()
      : null,
    officeToOrigin: form.officeToOrigin,
    roundTripDrive: form.roundTripDrive,
    roundTripMiles: form.roundTripMiles,
    salesRep: form.salesRep,
    segmentDistances: form.segmentDistances,
    serviceType: form.serviceType,
    startingMoveTime: form.startingMoveTime,
    totalMiles: form.totalMiles,
    travelFeeRate: form.travelFeeRate,
    travelFeeMethod: form.travelFeeMethod,
    trucks: form.trucks,
  };
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const toItemCreateInput = (d: ItemFormData): Result<ItemCreateInput> => {
  if (d.size == null) return { ok: false, error: "Size is required" };
  if (d.weight == null) return { ok: false, error: "Weight is required" };

  return { ok: true, value: { ...d, size: d.size, weight: d.weight } };
};
