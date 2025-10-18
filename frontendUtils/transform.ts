import {
  CreateLaborFormData,
  ItemFormData,
  MoveFormData,
} from "@/types/form-types";
import { CreateMoveInput } from "@/hooks/moves";
import { ItemCreateInput } from "@/hooks/items";
import { LaborCreateInput } from "@/hooks/labor";
export const transformToCreateMoveInput = (
  formData: MoveFormData
): CreateMoveInput => {
  if (!formData.companyId) {
    throw new Error("Company ID is required.");
  }

  if (!formData.salesRep) {
    throw new Error("Sales Rep is required.");
  }

  if (!formData.moveCustomerId) {
    throw new Error("Customer ID is required.");
  }

  if (!formData.referralId) {
    throw new Error("Referral is required.");
  }

  return {
    arrivalTimes: formData.arrivalTimes,
    companyId: formData.companyId,
    creditCardFee: formData.creditCardFee,
    deposit: formData.deposit,
    paymentMethod: formData.paymentMethod,
    destinationToOrigin: formData.destinationToOrigin,
    endingMoveTime: formData.endingMoveTime,
    jobType: formData.jobType,
    jobTypeRate: formData.jobTypeRate,
    liabilityCoverage: formData.liabilityCoverage,
    locations: formData.locations,
    moveCustomerId: formData.moveCustomerId,
    moveDate: formData.moveDate,
    moveFees: formData.moveFees,
    moveItems: formData.moveItems,
    moveStatus: formData.moveStatus,
    moveWindow: formData.moveWindow,
    movers: formData.movers,
    notes: formData.notes
      ? formData.notes.trim() === ""
        ? null
        : formData.notes.trim()
      : null,
    officeToOrigin: formData.officeToOrigin,
    referralId: formData.referralId,
    roundTripDrive: formData.roundTripDrive,
    roundTripMiles: formData.roundTripMiles,
    salesRep: formData.salesRep,
    segmentDistances: formData.segmentDistances,
    serviceType: formData.serviceType,
    startingMoveTime: formData.startingMoveTime,
    totalMiles: formData.totalMiles,
    travelFeeRate: formData.travelFeeRate,
    travelFeeMethod: formData.travelFeeMethod,
    trucks: formData.trucks,
  };
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const toItemCreateInput = (
  itemFormData: ItemFormData
): Result<ItemCreateInput> => {
  if (itemFormData.size == null) {
    return {
      ok: false,
      error: "Size is required",
    };
  }

  if (itemFormData.weight == null) {
    return {
      ok: false,
      error: "Weight is required",
    };
  }

  return {
    ok: true,
    value: {
      ...itemFormData,
      size: itemFormData.size,
      weight: itemFormData.weight,
    },
  };
};

const coerceToNumber = (possibleNumber: number | null): number =>
  typeof possibleNumber === "number" && !Number.isNaN(possibleNumber)
    ? possibleNumber
    : Number.NaN;

export const buildLaborCreateInput = (
  createLaborFormData: CreateLaborFormData
): Result<LaborCreateInput> => {
  if (!createLaborFormData.name.trim()) {
    return {
      ok: false,
      error: "Labor name is required",
    };
  }

  const startDateMs = coerceToNumber(createLaborFormData.startDate);
  const endDateMs = coerceToNumber(createLaborFormData.endDate);
  const twoMoversRate = coerceToNumber(createLaborFormData.twoMovers);
  const threeMoversRate = coerceToNumber(createLaborFormData.threeMovers);
  const fourMoversRate = coerceToNumber(createLaborFormData.fourMovers);
  const extraMoverRate = coerceToNumber(createLaborFormData.extra);

  if (Number.isNaN(startDateMs)) {
    return {
      ok: false,
      error: "Start date is required",
    };
  }

  if (Number.isNaN(endDateMs)) {
    return {
      ok: false,
      error: "End date is required",
    };
  }

  if (Number.isNaN(twoMoversRate)) {
    return {
      ok: false,
      error: "Two movers rate is required",
    };
  }

  if (Number.isNaN(threeMoversRate)) {
    return {
      ok: false,
      error: "Three movers rate is required",
    };
  }

  if (Number.isNaN(fourMoversRate)) {
    return {
      ok: false,
      error: "Four movers rate is required",
    };
  }

  if (Number.isNaN(extraMoverRate)) {
    return {
      ok: false,
      error: "Extra rate is required",
    };
  }

  if (startDateMs > endDateMs) {
    return {
      ok: false,
      error: "Start date cannot be after end date",
    };
  }

  return {
    ok: true,
    value: {
      name: createLaborFormData.name.trim(),
      startDate: startDateMs,
      endDate: endDateMs,
      twoMovers: twoMoversRate,
      threeMovers: threeMoversRate,
      fourMovers: fourMoversRate,
      extra: extraMoverRate,
    },
  };
};
