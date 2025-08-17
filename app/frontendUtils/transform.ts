import {
  CreateLaborFormData,
  ItemFormData,
  MoveFormData,
} from "@/types/form-types";

import { CreateMoveInput } from "../app/[slug]/add-move/hooks/createMove";
import { ItemCreateInput } from "../app/[slug]/move-setup/hooks/useCreateItem";
import { LaborCreateInput } from "../app/[slug]/move-setup/hooks/useCreateLabor";

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
    segmentDistances: [],
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

const mustNumber = (v: number | null): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : NaN;

export const buildLaborCreateInput = (
  d: CreateLaborFormData
): Result<LaborCreateInput> => {
  if (!d.name.trim()) return { ok: false, error: "Labor name is required" };

  const startDate = mustNumber(d.startDate);
  const endDate = mustNumber(d.endDate);
  const two = mustNumber(d.twoMovers);
  const three = mustNumber(d.threeMovers);
  const four = mustNumber(d.fourMovers);
  const extra = mustNumber(d.extra);

  if (Number.isNaN(startDate))
    return { ok: false, error: "Start date is required" };
  if (Number.isNaN(endDate))
    return { ok: false, error: "End date is required" };
  if (Number.isNaN(two))
    return { ok: false, error: "Two movers rate is required" };
  if (Number.isNaN(three))
    return { ok: false, error: "Three movers rate is required" };
  if (Number.isNaN(four))
    return { ok: false, error: "Four movers rate is required" };
  if (Number.isNaN(extra))
    return { ok: false, error: "Extra rate is required" };

  if (startDate > endDate) {
    return { ok: false, error: "Start date cannot be after end date" };
  }

  return {
    ok: true,
    value: {
      name: d.name.trim(),
      startDate,
      endDate,
      twoMovers: two,
      threeMovers: three,
      fourMovers: four,
      extra,
    },
  };
};
